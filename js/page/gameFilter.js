/**

RoPro (https://ropro.io) v1.3

RoPro was wholly designed and coded by:
                               
,------.  ,--. ,-----.,------. 
|  .-.  \ |  |'  .--./|  .---' 
|  |  \  :|  ||  |    |  `--,  
|  '--'  /|  |'  '--'\|  `---. 
`-------' `--' `-----'`------' 
                            
Contact me with inquiries (job offers welcome) at:

Discord - Dice#1000
Email - dice@ropro.io
Phone - ‪(650) 318-1631‬

Write RoPro:

Dice Systems LLC
1629 K. Street N.W.
Suite 300
Washington, DC
20006-1631

RoPro Terms of Service:
https://ropro.io/terms

RoPro Privacy Policy:
https://ropro.io/privacy-policy

© 2021 Dice Systems LLC
**/


genreDropdownHTML = `<div id = "genreDropdown" style="overflow:visible;margin-top:-5px;margin-left:0px;float:left;width:150px;margin-left:10px;" class="input-group-btn group-dropdown">
<button type="button" style="border-radius:0px;border:none;" class="input-dropdown-btn" data-toggle="dropdown" aria-expanded="false"> 
<span id="genreLabel" class="rbx-selection-label ng-binding" style="width:110px;overflow:hidden;" ng-bind="layout.selectedTab.label">Genre Filter</span> 
<span class="icon-down-16x16"></span></button>
<ul style="max-height:1000px;" id="genreOptions" data-toggle="dropdown-menu" class="dropdown-menu" role="menu"> 
</ul></div>`

customDropdownHTML = `<div id = "customDropdown" style="overflow:visible;margin-top:-5px;margin-left:0px;float:left;width:150px;" class="input-group-btn group-dropdown">
<button style="border-radius:0px;border:none;" type="button" class="input-dropdown-btn" data-toggle="dropdown" aria-expanded="false"> 
<span id="customLabel" class="rbx-selection-label" style="width:110px;overflow:hidden;" ng-binding" ng-bind="layout.selectedTab.label">${chrome.i18n.getMessage("moreFilters")}</span> 
<span class="icon-down-16x16"></span></button>
<ul style="max-height:1000px;" id="customOptions" data-toggle="dropdown-menu" class="dropdown-menu" role="menu"> 
</ul></div>`

likeRatioSliderHTML = `<div style="float:left;width:300px;margin-left:0px;margin-top:-2px;">
<span style="float:left;margin-top:5px;transform:scale(0.8);" class="icon-dislike selected"></span>
<input id="likeRatio" oninput="this.nextElementSibling.nextElementSibling.value = this.value + '%'" value="50" max="100" min="1" type="range" style="float:left; width:75px; height:30px; margin-top:2px;">
<span style="transform:scale(0.8);margin-top:1px;" class="icon-like selected"></span>
<output style="margin-left:0px;font-size:13px;vertical-align:bottom;">50%</output>
</div>`

/**
<div style="margin-left:10px;float:left;">
    <label class="ropro-switch">
  <input type="checkbox">
  <span class="ropro-slider"></span>
</label><span style="font-size:13px;font-family:Gotham;padding-top:5px;float:left;margin-top:-5px;margin-right:5px;margin-left:5px;line-height:12px;">Classic<br>Layout</span>
</div>
*/


var clocktheme = "dark"
if ($('.light-theme').length > 0) {
    var clocktheme = "light"
}

var allGames = {}
var gameBatch = []
var universeBatch = []
var currentGames = []
var genres = ["All", "Building", "Horror", "Town and City", "Military", "Comedy", "Medieval", "Adventure", "Sci-Fi", "Naval", "FPS", "RPG", "Sports", "Fighting", "Western", "Skatepark"]
var genreFilter = null
var customFilter = null
var filters = [chrome.i18n.getMessage("moreFilters"), "Single-player", "Gear Allowed", "Paid Access", "New Games", "Classic Games", "Recent Update", "Updated Today", "Under 1m Visits", "R15 Enabled", "Open Source"]

function fetchGenres(universes) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games?universeIds=" + universes.join(",")}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchPopularToday() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getMostPopularToday.php"},
			function(data) {
				resolve(data)
		})
	})
}

function fetchUniverseDetails(universeIds) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games?universeIds=" + universeIds.join(",")}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchGameIcons(universeIds) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://thumbnails.roblox.com/v1/games/icons?universeIds=" + universeIds.join(",") + "&size=150x150&format=Png&isCircular=false"}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchSetting(setting) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetSetting", setting: setting}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function singlePlayerSort(universe) {
	gameData = allGames[universe][1]
	return gameData.maxPlayers == 1
}

function gearAllowedSort(universe) {
	gameData = allGames[universe][1]
	return gameData.allowedGearCategories.length > 0
}

function paidAccessSort(universe) {
	gameData = allGames[universe][1]
	return gameData.price != null
}

function newGamesSort(universe) {
	gameData = allGames[universe][1]
	dateCreated = new Date(gameData.created).getTime()
	compareDate = new Date()
	compareDate.setMonth(compareDate.getMonth() - 6)
	timeElapsed = compareDate - dateCreated
	return timeElapsed <= 0
}

function classicGamesSort(universe) {
	gameData = allGames[universe][1]
	dateCreated = new Date(gameData.created).getTime()
	compareDate = new Date()
	compareDate.setFullYear(compareDate.getFullYear() - 5)
	timeElapsed = compareDate - dateCreated
	return timeElapsed > 0
}

function recentlyUpdatedSort(universe) {
	gameData = allGames[universe][1]
	dateUpdated = new Date(gameData.updated).getTime()
	compareDate = new Date()
	compareDate.setDate(compareDate.getDate() - 5)
	timeElapsed = compareDate - dateUpdated
	return timeElapsed <= 0
}

function updatedTodaySort(universe) {
	gameData = allGames[universe][1]
	dateUpdated = new Date(gameData.updated).getTime()
	compareDate = new Date()
	compareDate.setDate(compareDate.getDate() - 1)
	timeElapsed = compareDate - dateUpdated
	return timeElapsed <= 0
}

function underOneMillionVisitsSort(universe) {
	gameData = allGames[universe][1]
	return gameData.visits < 1000000
}

function rFifteenEnabledSort(universe) {
	gameData = allGames[universe][1]
	return (gameData.universeAvatarType == "MorphToR15" || gameData.universeAvatarType == "PlayerChoice")
}

function openSourceSort(universe) {
	gameData = allGames[universe][1]
	return gameData.studioAccessToApisAllowed
}


function filterGame(universeId) {
	if (universeId in allGames) {
		switch(customFilter) {
			case "Single-player":
				return singlePlayerSort(universe)
			case "Gear Allowed":
				return gearAllowedSort(universe)
			case "Paid Access":
				return paidAccessSort(universe)
			case "New Games":
				return newGamesSort(universe)
			case "Classic Games":
				return classicGamesSort(universe)
			case "Recent Update":
				return recentlyUpdatedSort(universe)
			case "Updated Today":
				return updatedTodaySort(universe)
			case "Under 1m Visits":
				return underOneMillionVisitsSort(universe)
			case "R15 Enabled":
				return rFifteenEnabledSort(universe)
			case "Open Source":
				return openSourceSort(universe)
			default:
				return true
		}
	}
}

function filterCustom() {
	for (universe in allGames) {
		game = allGames[universe]
		for (i = 0; i < game[0].length; i++) {
			gameCard = game[0][i]
			if (gameCard.getElementsByClassName('info-label vote-percentage-label').length > 0) {
				showGame = filterGame(universe)
				if (showGame == false) {
					gameCard.style.display = "none"
				} else {
					if (currentGames == null || currentGames.includes(gameCard)) {
						gameCard.style.display = "inline-block"
					}
				}
			} else {
				if (customFilter != null) {
					gameCard.style.display = "none"
				}
			}
		}
		if (customFilter != null && document.getElementById('popularToday') != null) {
			document.getElementById('popularToday').parentNode.style.display = "none"
		} else if (document.getElementById('popularToday') != null) {
			document.getElementById('popularToday').parentNode.style.display = "block"
		}
	}
}

function createGenres() {
	genreOptionsList = document.getElementById('genreOptions')
	for (i = 0; i < genres.length; i++) {
		genre = genres[i]
		li = document.createElement('li')
		li.innerHTML += `
				<a genre="${stripTags(genre)}" class="genreChoice">
					<span ng-bind="tab.label" class="ng-binding">${stripTags(genre)}</span>
				</a>`
		if (genreOptionsList.getElementsByTagName('li').length < genres.length) {
			genreOptionsList.appendChild(li)
			genreChoice = li.getElementsByClassName('genreChoice')[0]
			genreChoice.addEventListener("click", function() {
				genre = this.getAttribute("genre")
				document.getElementById('genreLabel').innerHTML = stripTags(genre)
				if (genre == "All") {
					genre = null
				}
				genreFilter = genre
				filterGenres()
			})
		}
	}
}

function createCustom() {
	customOptionsList = document.getElementById('customOptions')
	for (i = 0; i < filters.length; i++) {
		custom = filters[i]
		li = document.createElement('li')
		li.innerHTML += `
				<a custom="${stripTags(custom)}" class="customChoice">
					<span ng-bind="tab.label" class="ng-binding">${stripTags(custom)}</span>
				</a>`
		if (customOptionsList.getElementsByTagName('li').length < filters.length) {
			customOptionsList.appendChild(li)
			customChoice = li.getElementsByClassName('customChoice')[0]
			customChoice.addEventListener("click", function() {
				custom = this.getAttribute("custom")
				document.getElementById('customLabel').innerHTML = custom
				if (custom == chrome.i18n.getMessage("moreFilters")) {
					custom = null
				}
				customFilter = custom
				filterCustom()
			})
		}
	}
}

function filterGenres() {
	if (genreFilter != null) {
		currentGames = []
		for (universe in allGames) {
			game = allGames[universe]
			for (i = 0; i < game[0].length; i++) {
				gameCard = game[0][i]
				gameDetail = game[1]
				if (gameCard.getElementsByClassName('game-card-native-ad').length > 0 || typeof gameDetail.genre == "undefined" || gameDetail.genre != genreFilter) {
					gameCard.style.display = "none"
				} else {
					gameCard.style.display = "inline-block"
					currentGames.push(gameCard)
				}
			}
		}
		if (document.getElementById('popularToday') != null) {
			document.getElementById('popularToday').parentNode.style.display = "none"
		}
	} else {
		currentGames = null
		for (universe in allGames) {
			game = allGames[universe]
			for (i = 0; i < game[0].length; i++) {
				gameCard = game[0][i]
				gameCard.style.display = "inline-block"
			}
		}
		if (document.getElementById('popularToday') != null) {
			document.getElementById('popularToday').parentNode.style.display = "block"
		}
	}
}

function filterLikeRatio(ratio) {
	ratio = parseInt(ratio)
	for (universe in allGames) {
		game = allGames[universe]
		for (i = 0; i < game[0].length; i++) {
			gameCard = game[0][i]
			if (gameCard.getElementsByClassName('info-label vote-percentage-label').length > 0) {
				gameRatio = parseInt(gameCard.getElementsByClassName('info-label vote-percentage-label')[0].innerHTML.replace("%", ""))
				if (gameRatio < ratio) {
					gameCard.style.display = "none"
				} else {
					if (currentGames.length == 0 || currentGames.includes(gameCard)) {
						gameCard.style.display = "inline-block"
					}
				}
			} else {
				if (ratio != 50) {
					gameCard.style.display = "none"
				}
			}
		}
	}
	if (ratio != 50 && document.getElementById('popularToday') != null) {
		document.getElementById('popularToday').parentNode.style.display = "none"
	} else if (document.getElementById('popularToday') != null) {
		document.getElementById('popularToday').parentNode.style.display = "block"
	}
}

async function doBatch() {
	universeBatch = []
	gameBatch = []
	cards = $(".game-card.game-tile:not('.checked')")
	if (typeof cards != "undefined" && cards.length == 0) {
		cards = $(".featured-game-tile:not('.checked')")
	}
	if (typeof cards != "undefined" && cards.length == 0) {
		cards = $(".hover-game-tile:not('.checked')")
	}
	if (typeof cards != "undefined" && cards.length == 0) {
		cards = $(".game-card-container:not('.checked')")
	}
	for (i = 0; i < Math.min(cards.length, 100); i++) {
		card = cards.get(i)
		gameBatch.push(card)
		card.setAttribute("checked", true)
		card.classList.add("checked")
	}
	for (i = 0; i < gameBatch.length; i++) {
		gameCard = gameBatch[i]
		universeId = gameCard.getElementsByClassName('game-card-link')[0].getAttribute('id')
		if (universeId == null) {
			universeId = gameCard.getAttribute('id')
		}
		if (!(universeId in allGames)) {
			allGames[universeId] = [[gameCard]]
		} else {
			allGames[universeId][0].push(gameCard)
		}
		universeBatch.push(universeId)
	}
	if (universeBatch.length > 0) {
		gameDetails = await fetchGenres(universeBatch)
		gameDetails = gameDetails.data
		for (i = 0; i < gameDetails.length; i++) {
			gameDetail = gameDetails[i]
			allGames[gameDetail.id.toString()].push(gameDetail)
		}
		if (genreFilter != null) {
			filterGenres()
		}
		//filterLikeRatio(document.getElementById("likeRatio").value)
		if (customFilter != null) {
			filterCustom(customFilter)
		}
	}
}

function getPageLeft(el) {
    var rect = el.getBoundingClientRect();
    var docEl = document.documentElement;
    return rect.left + (window.pageXOffset || docEl.scrollLeft || 0)
}

function getPageTop(el) {
    var rect = el.getBoundingClientRect();
    var docEl = document.documentElement;
    return rect.top + (window.pageYOffset || docEl.scrollTop || 0)
}

var mainGamesPage = false
var inserted = false

document.getElementsByTagName('body')[0].style.minHeight="1000px"

const initialInterval = setInterval(function(){
	//if (window.location.href.includes("sortName")) {
		if (document.getElementById("genreDropdown") == null && inserted == false && (typeof $('.container-header.games-filter-changer h3').get(0) != 'undefined' || typeof $('.search-result-header').get(0) != 'undefined' || typeof $('.game-sort-detail-container').get(0) != 'undefined')) { //First page load
			clearInterval(initialInterval)
			containers = document.getElementsByClassName('games-list-container is-windows')
			if (containers.length > 0) {
				link = containers[0].childNodes[0]
				if (link.tagName == "A") {
					mainGamesPage = true
				}
			}
			async function addDropdowns() {
				firstHeader = $('.container-header.games-filter-changer h3').get(0)
				if (typeof firstHeader == "undefined") {
					firstHeader = $('.search-result-header h3').get(0)
				}
				if (typeof firstHeader == "undefined") {
					firstHeader = $('.game-sort-detail-container h3').get(0)
				}
				contentDiv = document.createElement("div")
				contentDiv.style.position = "static"
				contentDiv.style.float = "left"
				contentDiv.style.left = (getPageLeft(firstHeader) + firstHeader.offsetWidth + 20) + "px"
				contentDiv.style.zIndex = "10000"
				contentDiv.id = "filterDiv"
				contentWindow = document.getElementsByClassName('content')[0]
				if (document.getElementById('games-carousel-page') != null && typeof document.getElementById('games-carousel-page') != 'undefined') {
					document.getElementById('games-carousel-page').insertBefore(contentDiv, document.getElementById('games-carousel-page').childNodes[0])
				} else {
					contentWindow.insertBefore(contentDiv, contentWindow.childNodes[0])
				}
				h3 = $('.container-header.games-filter-changer h3')
				if (mainGamesPage && h3.length > 0) {
					h3.get(0).parentNode.insertBefore(document.createElement("br"), h3.get(0))
					h3.get(0).parentNode.insertBefore(document.createElement("br"), h3.get(0))
				} else if ($('.search-result-header').length > 0) {
					$('.search-result-header').get(0).parentNode.insertBefore(document.createElement("br"), $('.search-result-header').get(0))
					$('.search-result-header').get(0).parentNode.insertBefore(document.createElement("br"), $('.search-result-header').get(0))
				}
				var genreFiltersSetting = await fetchSetting("genreFilters")
				var moreGameFiltersSetting = await fetchSetting("moreGameFilters")
				var gameLikeRatioFilterSetting = await fetchSetting("gameLikeRatioFilter")
				if (document.getElementById('randomGameButton') != null) {
					document.getElementById('randomGameButton').style.display = "block"
				}
				if (genreFiltersSetting) {
					if (document.getElementById('genreDropdown') == null) {
						if (mainGamesPage || document.getElementsByClassName('game-sort-detail-container').length > 0) {
							contentDiv.innerHTML += genreDropdownHTML
						} else {
							if (document.getElementsByClassName('search-result-header').length > 0) {
								contentDiv.innerHTML += genreDropdownHTML
							}
						}
					}
				} else {
					div = document.createElement("div")
					div.setAttribute("id", "genreDropdown")
					contentDiv.appendChild(div)
				}
				if (moreGameFiltersSetting && document.getElementById('customDropdown') == null) {
					if (mainGamesPage || document.getElementsByClassName('game-sort-detail-container').length > 0) {
						contentDiv.innerHTML += customDropdownHTML
					} else {
						if (document.getElementsByClassName('search-result-header').length > 0) {
							contentDiv.innerHTML += customDropdownHTML
						}
					}
				}
				if (gameLikeRatioFilterSetting && document.getElementById('likeRatio') == null) {
					if (mainGamesPage || document.getElementsByClassName('game-sort-detail-container').length > 0) {
						contentDiv.innerHTML += likeRatioSliderHTML
					} else {
						if (document.getElementsByClassName('search-result-header').length > 0) {
							contentDiv.innerHTML += likeRatioSliderHTML
						}
					}
					$('input[type="range"]:not("#choicesRatio")').on("change mousemove", function () {
							var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'))
							$(this).css('background-image', '-webkit-gradient(linear, left center, right center, color-stop(' + val + ', #14B65A), color-stop(' + val + ', #D76A6B))')
					})
					$('input[type="range"]:not("#choicesRatio")').on("input", function () {
							var val = $(this).val()
							filterLikeRatio(val)
					})
				}
			}
			inserted = true
			addDropdowns()
			setTimeout(async function(){
				if (await fetchSetting("genreFilters")) {
					createGenres()
				}
				if (await fetchSetting("moreGameFilters")) {
					createCustom()
				}
			}, 1000)
		}
	//}
}, 10)

setInterval(function() {
	doBatch()
}, 1000)

function addCommas(nStr){
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.abs(num) > 999999 ? Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'm' : Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

function addPopularGame(universeId, gameName, gameLink, gameIcon, hours) {
	gameHTML = `<li class="popular-today-card list-item game-card game-tile checked" id="${parseInt(universeId)}" title="${stripTags(gameName)}" style="display: inline-block;"><div class="game-card-container"><a class="game-card-link" href="${stripTags(gameLink)}" id="${parseInt(universeId)}"><div class="game-card-thumb-container"><span class="thumbnail-2d-container game-card-thumb"><img class="" src="${stripTags(gameIcon)}" alt="${stripTags(gameName)}" title="${stripTags(gameName)}"></span></div><div class="game-card-name game-name-title" title="${stripTags(gameName)}">${stripTags(gameName)}</div><div style="margin-top:-4px;" class="game-card-info">
    <img style="background-image:none;margin:-6px;margin-top:0px;margin-bottom:0.5px;transform:scale(0.4);border:none;margin-left:-8px;margin-top:-0.6px;margin-right:-9px;" src="https://ropro.io/images/timer_${stripTags(clocktheme)}.svg" class="info-label icon-pastname"><span style="font-size:10.5px;" title="Played for ${addCommas(parseInt(hours).toString())} hours by RoPro users in the last 24 hours" class="info-label vote-percentage-label">${kFormatter(parseInt(hours))} Hours Today</span>
    </div></a></div></li>`
	popularToday = document.getElementById('popularToday')
	if (popularToday != null) {
		gameCards = popularToday.parentNode.getElementsByClassName('game-cards')[0]
		gameCards.innerHTML += gameHTML
	}
}

async function loadPopularToday() {
	popularTodayRow = document.getElementById('popularToday')
	popularToday = await fetchPopularToday()
	popularToday = JSON.parse(popularToday)
	universeIds = []
	universeDict = {}
	for (i = 0; i < popularToday.length; i++) {
		universeIds.push(popularToday[i].universeid)
		universeDict[popularToday[i].universeid] = popularToday[i].hours
	}
	universeDetails = await fetchUniverseDetails(universeIds)
	universeIcons = await fetchGameIcons(universeIds)
	for (i = 0; i < universeDetails.data.length; i++) {
		universeDict[universeDetails.data[i].id] = {"name": universeDetails.data[i].name, "link": "https://www.roblox.com/games/" + universeDetails.data[i].rootPlaceId, "hours": universeDict[universeDetails.data[i].id]}
	}
	for (i = 0; i < universeIcons.data.length; i++) {
		universeDict[universeIcons.data[i].targetId]["icon"] = universeIcons.data[i].imageUrl
	}
	document.getElementById('popularTodayLoading').remove()
	for (i = 0; i < universeIds.length; i++) {
		addPopularGame(universeIds[i], universeDict[universeIds[i]].name, universeDict[universeIds[i]].link, universeDict[universeIds[i]].icon, universeDict[universeIds[i]].hours)
	}
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

async function addRoProPopular() {
	if (await fetchSetting("popularToday") && document.getElementById('popularToday') == null) {
		leftScroll = 0;
		roProPopularHTML = `<div id="popularToday" class="container-header games-filter-changer popular-today"><h3>Popular Today With RoPro Users</h3></div></a><div class="horizontal-scroller games-list"><span id="popularTodayLoading" style="position:absolute; top:0px; right:0px; display: block; width: 100px; height: 120px; visibility: initial !important;margin-right:calc(50% - 50px);margin-top:10px;transform:scale(1);" class="spinner spinner-default"></span><div class="clearfix horizontal-scroll-window"><div class="horizontally-scrollable" style="left: 0px;"><ul class="hlist games game-cards game-tile-list"></ul></div><div class="scroller prev disabled" role="button" aria-hidden="true"><div class="arrow"><span class="icon-games-carousel-left"></span></div></div><div class="scroller next" role="button" aria-hidden="true"><div class="arrow"><span class="icon-games-carousel-right"></span></div></div></div></div>`
		div = document.createElement('div')
		div.setAttribute('class', 'games-list-container is-windows')
		div.innerHTML += roProPopularHTML
		for (i = 0; i < document.getElementsByClassName('games-list-container').length; i++) {
			container = document.getElementsByClassName('games-list-container')[i]
			if (container.getElementsByTagName('h3')[0].innerHTML == "Popular" && document.getElementById('popularToday') == null) {
				container.parentNode.insertBefore(div, container.nextElementSibling)
			}
		}
		if (document.getElementsByClassName('popular-today').length == 0 || document.getElementsByClassName('popular-today').length == 1) {
			loadPopularToday()
		}
		div.getElementsByClassName('scroller next')[0].addEventListener('click', function(){
			horizontalScroll = this.parentNode.getElementsByClassName('horizontally-scrollable')[0]
			scrollNext = this.parentNode.getElementsByClassName('scroller next')[0]
			scrollPrev = this.parentNode.getElementsByClassName('scroller prev')[0]
			difference = getOffset(scrollNext).left - getOffset(scrollPrev).left
			cardWidth = this.parentNode.getElementsByClassName('game-card')[0].offsetWidth
			if (!this.classList.contains("disabled")) {
				leftScroll = leftScroll - Math.floor(difference / cardWidth) * cardWidth
				horizontalScroll.style.left = leftScroll + "px"
				if (this.parentNode.getElementsByClassName('game-card').length < Math.abs(Math.floor(leftScroll / cardWidth)) + Math.ceil(difference / cardWidth)) {
					scrollNext.classList.add("disabled")
				}
				if (Math.abs(Math.floor(leftScroll / cardWidth)) > 0) {
					scrollPrev.classList.remove("disabled")
				}
			}
		})
		div.getElementsByClassName('scroller prev')[0].addEventListener('click', function(){
			horizontalScroll = this.parentNode.getElementsByClassName('horizontally-scrollable')[0]
			scrollNext = this.parentNode.getElementsByClassName('scroller next')[0]
			scrollPrev = this.parentNode.getElementsByClassName('scroller prev')[0]
			difference = getOffset(scrollNext).left - getOffset(scrollPrev).left
			cardWidth = this.parentNode.getElementsByClassName('game-card')[0].offsetWidth
			if (!this.classList.contains("disabled")) {
				leftScroll = leftScroll + Math.floor(difference / cardWidth) * cardWidth
				if (leftScroll > 0) {
					leftScroll = 0
				}
				horizontalScroll.style.left = leftScroll + "px"
				if (Math.abs(Math.floor(leftScroll / cardWidth)) == 0) {
					scrollPrev.classList.add("disabled")
				}
				if (this.parentNode.getElementsByClassName('game-card').length >= Math.abs(Math.floor(leftScroll / cardWidth)) + Math.ceil(difference / cardWidth)) {
					scrollNext.classList.remove("disabled")
				}
			}
		})
	}
}

var myInterval = setInterval(function(){
    if (document.getElementsByClassName('container-header games-filter-changer').length > 0) {
		clearInterval(myInterval)
        if (document.getElementsByClassName('container-header games-filter-changer').length > 1) {
            addRoProPopular()
        }
    }
}, 500)
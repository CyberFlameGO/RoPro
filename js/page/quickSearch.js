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

var currentQuery = ""
var thumbnailsDict = {}
var queryDict = {}
var currentSearchInput = null

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
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

function fetchGame(keyword) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/list?keyword=" + encodeURIComponent(keyword) + "&startRows=0&maxRows=1&hasMoreRows=true&isKeywordSuggestionEnabled=false"},
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchThumbnail(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://thumbnails.roblox.com/v1/games/icons?universeIds=" + parseInt(universeId) + "&size=150x150&format=Png&isCircular=false"},
			function(data) {
				resolve(data)
			}
		)
	})
}

async function getGame(keyword) {
	games = await fetchGame(keyword)
	if (games.games.length > 0) {
		return games.games[0]
	} else {
		return null
	}
}

function setLocalStorage(key, value) {
	return new Promise(resolve => {
		chrome.storage.local.set({[key]: value}, function(){
			resolve()
		})
	})
}

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
 }

function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}

async function handleInput(e) {
	if ($("#navbar-search-input").val() != "") {
		if (e.type == "keydown" && e.originalEvent.code == "ArrowUp" && $('.ropro-quick-game-search').length > 0) {
			if ($('.ropro-quick-game-search').get(0).classList.contains('new-selected')) {
				$('.ropro-quick-game-search').get(0).classList.remove('new-selected')
			} else {
				nextsibling = $('.ropro-quick-game-search').get(0).nextElementSibling
				if (nextsibling.classList.contains('new-selected')) {
					e.stopPropagation()
					nextsibling.classList.remove('new-selected')
					$('.ropro-quick-game-search').get(0).classList.add('new-selected')
				}
			}
		}
		if (e.type == "keydown" &&  e.originalEvent.code == "ArrowDown" && $('.ropro-quick-game-search').length > 0) {
			if ($('.ropro-quick-game-search').get(0).classList.contains('new-selected')) {
				$('.ropro-quick-game-search').get(0).classList.remove('new-selected')
			} else {
				experiences = $('.ropro-quick-game-search').get(0).previousElementSibling
				if (experiences.classList.contains('new-selected')) {
					e.stopPropagation()
					experiences.classList.remove('new-selected')
					$('.ropro-quick-game-search').get(0).classList.add('new-selected')
				}
			}
		}
	}
	if (e.type != "keydown") {
		if (e.type == "keyup" && e.originalEvent.code == "Enter" && $('.ropro-quick-game-search').length > 0) {
			if ($('.ropro-quick-game-search').get(0).classList.contains('new-selected')) {
				$('.ropro-quick-game-search a').get(0).click()
				e.stopPropagation()
				return
			}
		}
		var query = $("#navbar-search-input").val()
		if (query.length > 0 && query != currentQuery) {
			currentQuery = query
			if (query in queryDict) {
				var game = queryDict[query]
			} else {
				var game = await getGame(query)
				queryDict[query] = game
			}
			if (query == $("#navbar-search-input").val() && game != null) {
				quicksearchHTML = `<li style="height:0px;" universeId="0" class="ropro-quick-game-search quick-game-search navbar-search-option rbx-clickable-li"><a id="ropro-quick-search-link" href="https://roblox.com/games/${parseInt(game.placeId)}#ropro-quick-search" style="height:57px;position:relative;display:flex;align-items:center;padding-top:0px;padding-bottom:0px;"><div style="position:relative;display:inline-block;width:36px;height:36px;margin:-6px 6px -6px 0;border-radius:2px;border:1px solid #a0a0a0"><span><img class="ropro-quick-search-game-icon" style="width:100%;height:100%;opacity:0;transition:opacity .5s ease;" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="></span></div><div><div style="width:230px;font-size: 16px; font-weight:300;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;"><b>${stripTags(game.name)}</b></div><div style="display:inline-block;font-size:12px;font-weight:400;" class="text-label">${stripTags(game.creatorName)}</div><div style="display:inline-block!important;"><span class="info-label icon-playing-counts-gray" style="transform:scale(0.45);margin:-10px;margin-left:0px;margin-right:-6px;"></span><span style="font-size:11px;" class="info-label playing-counts-label" title="${parseInt(game.playerCount)} Current Players">${kFormatter(parseInt(game.playerCount))}</span></div><button id="ropro-quick-play-button" type="button" style="position:absolute;right:31.5px;top:4px;width:50px;min-width:50px;height:50px;min-height:50px;padding:5px;transform:scale(0.6);" class="btn-full-width btn-common-play-game-lg btn-primary-md btn-min-width roproquickjoin" data-testid="play-button"><div class="quick-game-search-tooltip" style="display:none;position:absolute;width:auto;background-color:#191B1D;color:white;top:-30px;right:-40px;font-size:13px;padding:5px;border-radius:5px;">RoPro Quick Play</div><span style="margin-left:3px;transform:scale(0.75);" class="icon-common-play"></span></button>
				<button type="button" id="ropro-quick-random-server-button" style="position:absolute;right:0px;top:4px;width:50px;min-width:50px;height:50px;min-height:50px;padding:5px;transform:scale(0.6);" class="btn-full-width btn-common-play-game-lg btn-primary-md btn-min-width roproquickjoin" data-testid="play-button"><div class="quick-game-search-tooltip" style="display:none;position:absolute;width:auto;background-color:#191B1D;color:white;top:-30px;right:-20px;font-size:13px;padding:5px;border-radius:5px;">Random Server</div><span style="margin-left:0px;transform:scale(0.75);filter:invert(1);background-image:url(https://ropro.io/images/random_server.svg);background-size: 36px 36px;" class="icon-common-play"></span></button></div></a></li>`
				search = document.getElementsByClassName('navbar-search')
				if (search.length > 0) {
					experiences = $(search[0]).find('.navbar-search-option:has(.navbar-list-option-suffix:contains(Experiences))')
					if (experiences.length > 0) {
						experiences = experiences.get(0)
						flag = false
						if ($('.ropro-quick-game-search').length > 0) {
							if (parseInt($('.ropro-quick-game-search').get(0).getAttribute('universeId')) == game.universeId) {
								flag = true
							}
						}
						$('.ropro-quick-game-search').remove()
						div = document.createElement('div')
						div.innerHTML = quicksearchHTML
						quicksearchLi = div.childNodes[0]
						quicksearchLi.setAttribute('universeId', parseInt(game.universeId))
						insertAfter(quicksearchLi, experiences)
						if (flag == false) {
							setTimeout(function(){
								quicksearchLi.classList.add('loaded')
							}, 10)
						} else {
							quicksearchLi.classList.add('loaded')
						}
						if (game.universeId in thumbnailsDict) {
							thumbnails = thumbnailsDict[game.universeId]
						} else {
							thumbnails = await fetchThumbnail(game.universeId)
							thumbnailsDict[game.universeId] = thumbnails
						}
						if (query == $("#navbar-search-input").val() && thumbnails.data.length > 0) {
							thumbnail = thumbnails.data[0].imageUrl
							gameIcon = quicksearchLi.getElementsByClassName('ropro-quick-search-game-icon')
							if (gameIcon.length > 0) {
								gameIcon[0].src = stripTags(thumbnail)
								gameIcon[0].style.opacity = 1
							}
						}
						document.getElementById('ropro-quick-random-server-button').addEventListener('mouseenter', function() {
							document.getElementById('ropro-quick-search-link').href = `https://roblox.com/games/${parseInt(game.placeId)}#ropro-random-server`
						})
						document.getElementById('ropro-quick-play-button').addEventListener('mouseenter', function() {
							document.getElementById('ropro-quick-search-link').href = `https://roblox.com/games/${parseInt(game.placeId)}#ropro-quick-play`
						})
						document.getElementById('ropro-quick-random-server-button').addEventListener('mouseleave', function() {
							document.getElementById('ropro-quick-search-link').href = `https://roblox.com/games/${parseInt(game.placeId)}#ropro-quick-search`
						})
						document.getElementById('ropro-quick-play-button').addEventListener('mouseleave', function() {
							document.getElementById('ropro-quick-search-link').href = `https://roblox.com/games/${parseInt(game.placeId)}#ropro-quick-search`
						})
						document.getElementById('ropro-quick-search-link').addEventListener('click', function() {
							setLocalStorage('quickSearchLinkClicked', Date.now())
						})
					}
				}
			}
		} else if (query.length == 0) {
			currentQuery = ""
		}
	}
}


async function quicksearchMain() {
	if (await fetchSetting('experienceQuickSearch')) {
		var navbarSearchInterval = setInterval(async function() {
			if (document.getElementById('navbar-search-input') != currentSearchInput) {
				currentSearchInput = document.getElementById('navbar-search-input')
				$(document.getElementById('navbar-search-input')).bind('input change paste keyup keydown mouseup', function(e){
					handleInput(e)
				})
			}
		}, 100)
	}
}

quicksearchMain()
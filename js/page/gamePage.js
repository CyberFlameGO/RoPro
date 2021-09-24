/**

RoPro (https://ropro.io) v1.2

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

var theme = "dark"
if ($('.light-theme').length > 0) {
    var theme = "light"
}

searchBarHTML = `<div id="searchServerMain" style="margin-top:5px;margin-bottom:25px;height:45px;position:relative;">
					<div style="float:left;width:400px;margin-left:5px;margin-bottom:10px;" class="input-group">
					<form><input autofocus="" id="searchServer" class="form-control input-field" type="text" placeholder="Enter Exact Username..." maxlength="120" autocomplete="off" value="">
					<div style="font-size:12px;color:red;" id="serverSearchError"></div>
					<div style="font-size:12px;color:green;" id="serverSearchSuccess"></div>
					</form>
					<div class="input-group-btn"><button style="margin:0px;margin-left:2px;" class="input-addon-btn" type="submit">
					<span class="icon-nav-search"></span>
					</button></div></div>
					<span id="searchServerButton" style="padding:10px;margin-bottom:10px;float-left;" class="btn-secondary-md btn-more rbx-private-server-create-button">Search</span>
					</div>`

gameRankHTML = `<div id="gameRankDiv" style="z-index:1000;position:absolute;margin-bottom:6px;visibility:initial;bottom:-10px;left:5px;"><div style="margin-left:2px;width:155px;height:24px;background-color:#0084DD;border-radius:150px;"><img style="left:0px;top:0px;position:absolute;margin-right:5px;" src="https://ropro.io/images/value_icon_medium.png" height="24px"><h5 id="valueAmount" style="font-size:15px;position:absolute;right:5px;top:-2px;width:100%;text-align:right;">Rank Today: #4</h5></div></div>`
mostRecentServerHTML = `<div class="stack" data-showshutdown="false"><div class="container-header"><h3>My Most Recent Server<img src="https://ropro.io/images/ropro_logo.png" style="filter: drop-shadow(1px 1px 1px #363636);width:45px;margin-left:5px;margin-bottom:2px;"></h3></div><ul id="rbx-recent-server-box" class="section rbx-friends-game-server-item-container stack-list section-content-off"><p class="no-servers-message">No Active Recent Server Found.</p></ul><div class="rbx-friends-running-games-footer"></div><div class="rbx-friends-game-server-template"><li class="stack-row rbx-friends-game-server-item"><div class="section-header"><div class="link-menu rbx-friends-game-server-menu"></div></div><div class="section-left rbx-friends-game-server-details"><div class="text-info rbx-game-status rbx-friends-game-server-status"></div><div class="rbx-friends-game-server-alert"><span class="icon-remove"></span>Slow Game</div><a class="btn-full-width btn-control-xs rbx-friends-game-server-join" href="#" data-placeid="">Join</a></div><div class="section-right rbx-friends-game-server-players"></div></li></div></div>`
gamecodesTipsPaneHTML = `<div class="tab-pane gamecodes" id="gamecodes" style="margin-top:20px;"><div id="rbx-game-passes" class="container-list game-dev-store game-passes"><div class="container-header"><h3>RoPro Gamecodes & Tips</h3></div></div></div>`
randomServerHTML = `<button type="button" style="width:66px;min-width:66px;margin-left:3px;" class="btn-full-width btn-common-play-game-lg btn-primary-md btn-min-width"><span style="filter:invert(1);background-image:url(https://ropro.io/images/random_server.svg);background-size: 36px 36px;" class="icon-common-play"></span></button>`
randomServerOverlayHTML = `<div id="simplemodal-overlay" class="simplemodal-overlay" style="background-color: rgb(0, 0, 0); opacity: 0.8; height: 100%; width: 100%; position: fixed; left: 0px; top: 0px; z-index: 1041;"></div>`
randomServerModalHTML = `<div id="simplemodal-container" class="simplemodal-container" style="position: fixed; z-index: 1042; height: 231px; width: 400px;  left: calc(50% - 200px); top: calc(50% - 115.5px);"><a class="modalCloseImg simplemodal-close" title="Close"></a><div tabindex="-1" class="simplemodal-wrap" style="height: 100%; outline: 0px; width: 100%; overflow: visible;"><div id="modal-confirmation" class="modal-confirmation noImage protocolhandler-are-you-installed-modal simplemodal-data" data-modal-type="confirmation" style="display: block;"><div id="modal-dialog" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true"><span class="icon-close"></span></span><span class="sr-only">Close</span> </button><h5 class="modal-title"></h5></div><div class="modal-body"><div class="modal-top-body"><div class="modal-message"><img src="https://ropro.io/images/ropro_logo.svg" width="150" alt="R"><p>Searching for a random server...</p></div><div class="modal-image-container roblox-item-image" data-image-size="medium" data-no-overlays="" data-no-click=""><img class="modal-thumb" alt="generic image"></div><div class="modal-checkbox checkbox" style="display: none;"><input id="modal-checkbox-input" type="checkbox"> <label for="modal-checkbox-input"></label></div></div><div style="display:none;" class="modal-btns"><a href="" id="confirm-btn" class="btn-primary-md">Download Studio</a> <a href="" id="decline-btn" class="btn-control-md" style="display: none;">No</a></div><div style="display:block;" class="loading modal-processing"><img class="loading-default" src="https://images.rbxcdn.com/4bed93c91f909002b1f17f05c0ce13d1.gif" alt="Processing..."></div></div><div class="modal-footer text-footer" style="display: block;"></div></div></div></div></div></div>`
var pageIndex = 0;
var customServerList = null;
var globalGameId = 0;
var hasFastServers = false;

function fetchPlayTime(gameID, time) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getPlayTime.php?universeid=" + gameID + "&time=" + time},
			function(data) {
					resolve(data)
			})
	})
}

function fetchMaxPlayerIndex(gameID, maxPlayers) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetMaxPlayerIndex", gameID: gameID, count: maxPlayers}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchLowPingServers(gameID, startIndex, maxServers) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetLowPingServers", gameID: gameID, startIndex: startIndex, maxServers: maxServers}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchServerSearch(username, gameID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetUserServer", username: username, gameID: gameID}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchServerPage(gameID, index) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + index},
			function(data) {
				resolve(data)
		})
	})
}

function fetchSocialLinks(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/"+universeId+"/social-links/list"}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchDiscordID(discordUrl) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getDiscordID.php?link=" + discordUrl}, 
			function(data) {
				resolve(data)
		})
	})
}


function fetchGameInfo(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games?universeIds=" + universeId}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchVotes(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/votes?universeIds=" + universeId}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchFavorites(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/" + universeId + "/favorites/count"}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchServerStatus(placeId, gameId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://assetgame.roblox.com/Game/PlaceLauncher.ashx?request=RequestGameJob&placeId="+placeId+"&gameId="+gameId}, 
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

function getLocalStorage(key) {
	return new Promise(resolve => {
		chrome.storage.local.get(key, function (obj) {
			resolve(obj[key])
		})
	})
}

function setLocalStorage(key, value) {
	return new Promise(resolve => {
		chrome.storage.local.set({[key]: value}, function(){
			resolve()
		})
	})
}

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

async function loadServerPage(gameID, index){
	if (customServerList == null) {
		serverPage = await fetchServerPage(gameID, index)
	} else {
		if (index < customServerList.length) {
			serverPage = {"Collection": customServerList.slice(index, Math.min(index + 10, customServerList.length))}
		} else {
			serverPage = {"Collection": []}
		}
	}
	serversHTML = ""
	for (i = 0; i < serverPage.Collection.length; i++) {
		server = serverPage.Collection[i]
		gameId = server.Guid
		placeId = server.PlaceId
		playerCount = server.CurrentPlayers.length + " out of " + server.Capacity + " max"
		playersHTML = ""
		additionalInfoDiv = ""
		if (customServerList != null) {
			additionalInfoDiv = `<div class="text-info rbx-game-status rbx-game-server-status" style="margin-top:5px;font-size:13px;">Server Ping: ${server.Ping} ms</div>`
		}
		for (j = 0; j < server.CurrentPlayers.length; j++) {
			player = server.CurrentPlayers[j]
			thumbnail = player.Thumbnail.Url
			playerHTML = `<span class="special-span avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image" src="${thumbnail}"></a></span>`
			playersHTML += playerHTML
		}
		serversHTML += `<li class="stack-row rbx-game-server-item"><div class="section-header">
						<div class="link-menu rbx-game-server-menu"></div></div>
						<div class="section-left rbx-game-server-details">
							<div class="text-info rbx-game-status rbx-game-server-status">${playerCount}</div>
							${additionalInfoDiv}
							<div class="rbx-game-server-alert hidden"><span class="icon-remove"></span></div>
							<a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="2202352383" onclick='Roblox.GameLauncher.joinGameInstance(${placeId}, "${gameId}")'>Join</a></div>
						<div class="section-right rbx-game-server-players">${playersHTML}</div></li>`
	}
	pageIndex = index
	document.getElementById('maxPlayersLoadingBar').style.display = "none"
	$('#rbx-game-server-item-container').html(serversHTML)
	$('.rbx-running-games-footer').html(`<button type="button" id="loadMoreButton" class="btn-control-sm btn-full-width rbx-running-games-load-more">Load More</button>`)
	$('#loadMoreButton').click(function(){
		loadServerPage(gameID, pageIndex+10)
	})
}

function createServerElement(server) {
	gameId = server.Guid
	placeId = server.PlaceId
	playerCount = server.CurrentPlayers.length + " out of " + server.Capacity + " max"
	li = document.createElement("li")
	li.setAttribute("id", "serverSearchResult")
	li.setAttribute("class", "stack-row rbx-game-server-item")
	li.setAttribute("style", "margin-bottom:30px;")
	li.setAttribute("data-gameid",stripTags(gameId.toString()))
	playersHTML = ""
	for (i = 0; i < server.CurrentPlayers.length; i++) {
		player = server.CurrentPlayers[i]
		thumbnail = player.Thumbnail.Url
		if (thumbnail == server.thumbnailToFind) {
			specialStyleSpan = "z-index:100000;"
			specialStyleImg = "transform:scale(1.5);"
			specialId = 'id="myGlower"'
		} else {
			specialStyleImg = ""
			specialStyleSpan = ""
			specialId = ''
		}
		playerHTML = `<span style="${specialStyleSpan}" class="special-span avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img ${specialId} style="${specialStyleImg}" class="avatar-card-image" src="${stripTags(thumbnail)}"></a></span>`
		playersHTML += playerHTML
	}
	serverHTML = `<div class="section-header">
					<div class="link-menu rbx-game-server-menu"></div></div>
					<div class="section-left rbx-game-server-details">
						<div class="text-info rbx-game-status rbx-game-server-status">${stripTags(playerCount)}</div>
						<div class="rbx-game-server-alert hidden"><span class="icon-remove"></span></div>
						<a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="2202352383" onclick='Roblox.GameLauncher.joinGameInstance(${parseInt(placeId)}, "${stripTags(gameId)}")'>Join</a></div>
					<div class="section-right rbx-game-server-players">${playersHTML}</div>`
	li.innerHTML = serverHTML
	document.getElementById('rbx-game-server-item-container').insertBefore(li, document.getElementById('rbx-game-server-item-container').childNodes[0])
	$(function() {
		var glower = $('#myGlower');
		setInterval(function() {  
			glower.toggleClass('active');
		}, 1000);
	})
}

function createMaxPlayers(maxPlayers) {
	dropdown = ""
	for (i = maxPlayers; i > 0; i--) {
		if (i == 1) {
			playerString = "Player"
		} else {
			playerString = "Players"
		}
		dropdown += `<li class="dropdown-custom-item" id="${parseInt(i)}"> <a style="font-size:13px;">${parseInt(i)} ${stripTags(playerString)}</a></li>`
	}
	fastServersButton = `<button style="height:38px;display:inline-block;margin-left:-160px;" type="button" id="fastServersButton" class="input-dropdown-btn category-options ng-scope"> 
			<span style="font-size:13px;" class="text-overflow rbx-selection-label ng-binding dropdown-button-text"> <a style="font-size:13px;">${stripTags(chrome.i18n.getMessage("FastestServers"))}</a></span>
			<span style="margin-right:-10px;margin-top:-1px;transform:scale(0.8);" class="icon-nav-my-feed"></span></button>`
	hasFastServers = true
	if (hasFastServers) {
		loadMargin = "310px"
	} else {
		loadMargin = "160px"
	}
	div = document.createElement("div")
	maxPlayersHTML = `<div style="float:right;width:150px;margin-top:-40px;" class="input-group-btn">
			<span id="maxPlayersLoadingBar" style="margin-right: ${stripTags(loadMargin)}; float: right; display: none; transform: scale(0.8); width: 100px; height: 25px; visibility: initial !important;" class="spinner spinner-default"></span>
            ${fastServersButton}
			<button style="height:38px;display:inline-block;" type="button" id="maxPlayerButton" class="input-dropdown-btn category-options ng-scope"> 
			<span style="font-size:13px;" class="text-overflow rbx-selection-label ng-binding dropdown-button-text">${stripTags(chrome.i18n.getMessage("MaxPlayers"))}</span> <span class="icon-down-16x16"></span> </button> 
            <ul page="0" style="width:150px;" id="maxPlayerDropdown" class="max-player-dropdown dropdown_menu dropdown_menu-4 dropdown-menu">
				${dropdown}
            </ul>
         </div>`
	div.innerHTML = maxPlayersHTML
	return div
}

function addRandomServerButton() {
	container = document.getElementById('game-details-play-button-container')
	div = document.createElement('div')
	div.innerHTML = randomServerHTML
	randomServerButton = div.childNodes[0]
	container.appendChild(randomServerButton)
	randomServerButton.addEventListener('click', function() {
		outer = document.getElementById('rbx-body')
		modalcontainer = document.createElement('div')
		modalcontainer.id = "randomGameModalContainer"
		outer.appendChild(modalcontainer)
		overlay = document.createElement('div')
		overlay.innerHTML = randomServerOverlayHTML
		modal = document.createElement('div')
		modal.innerHTML = randomServerModalHTML
		modalcontainer.appendChild(overlay)
		modalcontainer.appendChild(modal)
		modalcontainer.getElementsByClassName('close')[0].addEventListener('click', function() {
			document.getElementById('randomGameModalContainer').remove()
		})
	})
}

function addMaxPlayers(maxPlayers) {
	serverContainer = document.getElementById('rbx-running-games')
	maxPlayersDiv = createMaxPlayers(maxPlayers)
	serverContainer.insertBefore(maxPlayersDiv, serverContainer.childNodes[1])
	async function checkSettings() {
		if (await fetchSetting("serverSizeSort") == false) {
			document.getElementById('maxPlayerButton').style.display = "none"
		}
		if (await fetchSetting("fastestServersSort") == false) {
			document.getElementById('fastServersButton').style.display = "none"
		}
	}
	checkSettings()
	$("#maxPlayerButton").click(function(){
		$(this.parentNode).find("#maxPlayerDropdown").toggleClass("active")
	})
	$("#fastServersButton").click(async function(){
		document.getElementById('maxPlayersLoadingBar').style.display = "inline-block"
		document.getElementById('maxPlayersLoadingBar').style.marginRight = "310px"
		customServerList = await fetchLowPingServers(globalGameId, pageIndex, 1000)
		loadServerPage(globalGameId, 0)
	})
	$(".dropdown-custom-item").click(async function(){
		maxPlayerSelection = parseInt(this.id)
		$("#maxPlayerButton").find('.dropdown-button-text').html(this.innerHTML)
		$("#maxPlayerDropdown").toggleClass("active")
		if (window.location.href.includes("games/")) {
			gameID = window.location.href.split("games/")[1].split("/")[0]
		} else {
			gameID = window.location.href.split("experiences/")[1].split("/")[0]
		}
		document.getElementById('maxPlayersLoadingBar').style.display = "inline-block"
		index = await fetchMaxPlayerIndex(gameID, maxPlayerSelection)
		if (index != "NONE") {
			customServerList = null
			loadServerPage(gameID, index)
		} else {
			$("#maxPlayerButton").find('.dropdown-button-text').html("Error: None Found")
		}
	})
}

async function liveCounters() {
	async function loadCounters() {
		universeId = document.getElementById('game-detail-meta-data').getAttribute('data-universe-id')
		votes = await fetchVotes(universeId)
		favoritesData = await fetchFavorites(universeId)
		votes = votes.data[0]
		upvotes = document.getElementById('vote-up-text')
		downvotes = document.getElementById('vote-down-text')
		favorites = document.getElementsByClassName('game-favorite-count')[0]
		if (upvotes != null) {
			upvotes.style.fontSize = "11px"
			upvotes.innerHTML = addCommas(votes.upVotes)
		}
		if (downvotes != null) {
			downvotes.style.fontSize = "11px"
			downvotes.innerHTML = addCommas(votes.downVotes)
		}
		if (favorites != null) {
			favorites.innerHTML = addCommas(favoritesData.favoritesCount)
		}
	}
	if (await fetchSetting("liveLikeDislikeFavoriteCounters")) {
		setTimeout(function() {
			loadCounters()
		}, 1000)
		setInterval(function() {
			loadCounters()
		}, 10000)
	}
}

var timerArray = [];

function animateValue(obj, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start? Math.ceil(Math.abs(end-start)/500) : -1 * Math.ceil(Math.abs(end-start)/500);
    var stepTime = Math.abs(Math.floor(duration / (range/Math.abs(increment))));
    timer = setInterval(function() {
		if (start == currentVisits || start == currentPlayers) {
			current += increment;
			obj.innerHTML = addCommas(current);
			if ((increment >= 0 && current >= end) || (increment < 0 && current <= end)) {
				clearInterval(timer);
				obj.innerHTML = addCommas(end);
				obj.setAttribute("title", stripTags(obj.innerHTML))
			}
		}
	}, stepTime);
	timerArray.push([obj, timer])
}

async function livePlaying() {
	liveVisits = await fetchSetting("liveVisits");
	livePlaying = await fetchSetting("livePlayers");
	if (liveVisits || livePlaying) {
		async function loadPlaying() {
			if (liveVisits || livePlaying) {
				universeId = document.getElementById('game-detail-meta-data').getAttribute('data-universe-id')
				gameInfo = await fetchGameInfo(universeId)
				playing = gameInfo.data[0].playing
				visits = gameInfo.data[0].visits
				playingObj = document.getElementsByClassName('game-stat')[0].getElementsByTagName('p')[1]
				visitsObj = document.getElementById('game-visit-count')
				oldPlaying = parseInt(playingObj.innerHTML.replace(",","").replace(",","").replace(",",""))
				oldVisits = parseInt(visitsObj.getAttribute('title').replace(",","").replace(",","").replace(",","").replace(",",""))
				if (livePlaying) {
					playingObj.innerHTML = addCommas(oldPlaying)
				}
				if (liveVisits) {
					visitsObj.innerHTML = addCommas(oldVisits)
				}
				if (livePlaying) {
					for (i = 0; i < timerArray.length; i++) {
						if (timerArray[i][0] == playingObj) {
							clearInterval(timerArray[i][1])
						}
					}
					animateValue(playingObj, oldPlaying, playing, 5000);
					currentPlayers = oldPlaying;
				}
				if (oldVisits <= visits && liveVisits) {
					for (i = 0; i < timerArray.length; i++) {
						if (timerArray[i][0] == visitsObj) {
							clearInterval(timerArray[i][1])
						}
					}
					timerArray = []
					animateValue(visitsObj, oldVisits, visits, 10000);
					currentVisits = oldVisits;
				}
			}
		}
		setTimeout(loadPlaying, 1000)
		setInterval(loadPlaying, 20000)
	}
}

async function addSearchBar(gameID) {
	serverContainer = document.getElementById('rbx-running-games')
	searchBar = document.createElement("div")
	searchBar.innerHTML = searchBarHTML
	serverContainer.insertBefore(searchBar, serverContainer.childNodes[1])
	searchServerButton = document.getElementById('searchServerButton')
	searchServerButton.addEventListener("click", async function() {
		username = document.getElementById("searchServer").value
		if (username.length > 2) {
			prevResults = document.getElementById('serverSearchResult')
			if (prevResults != null) {
				prevResults.remove()
			}
			document.getElementById("serverSearchError").innerHTML = '<span class="spinner spinner-default"></span>'
			document.getElementById("serverSearchSuccess").innerHTML = ""
			server = await fetchServerSearch(username, gameID)
			if (server == "Not Found!") {
				document.getElementById("serverSearchError").innerHTML = "User " + stripTags(username) + " not found in game. Please wait or try again."
			} else if (server == "User Does Not Exist!") {
				document.getElementById("serverSearchError").innerHTML = "User " + stripTags(username) + " doesn't exist!"
			} else { //Found the server
				document.getElementById("serverSearchError").innerHTML = ""
				document.getElementById("serverSearchSuccess").innerHTML = "Found " + stripTags(username) + "!"
				createServerElement(server)
			}
		}
	})
}


function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
 }

async function addEmbeds(sectionContent, universeId) {
	socialLinks = await fetchSocialLinks(universeId)
	socialLinks = socialLinks.data
	console.log(socialLinks)
	for (i = 0; i < socialLinks.length; i++) {
		/* if (socialLinks[i].type == "Discord") {
			console.log(socialLinks[i])
			discordUrl = socialLinks[i].url
			discordID = await fetchDiscordID(discordUrl)
			console.log(discordID)
			if (isNormalInteger(discordID)) {
				div = document.createElement('div')
				discordFrameHTML = `<iframe src="https://discordapp.com/widget?id=${discordID}&amp;theme=dark" width="300" height="500" allowtransparency="true" frameborder="0" style="position:absolute;right:0px;top:710px;" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`
				div.innerHTML = discordFrameHTML
				sectionContent.appendChild(div)
			}
		} else  */if (socialLinks[i].type == "Twitter" && await fetchSetting("gameTwitter")) {
			twitterUrl = socialLinks[i].url
			twitterProfile = stripTags(twitterUrl.split('twitter.com/')[1])
			div = document.createElement('div')
			twitterFrameHTML = `<iframe src="https://ropro.io/twitterFrame.php?account=${stripTags(twitterProfile)}" width="342" height="100%" allowtransparency="true" frameborder="0" style="position:absolute;right:-250x;top:10px;" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`
			div.innerHTML = twitterFrameHTML
			sectionContent.appendChild(div)
		}
	}
}

async function addActiveServerCount(gameId) {
	servers = await fetchServerPage(gameId, 0)
	serverTab = document.getElementById('tab-game-instances').getElementsByTagName('span')
	if (serverTab.length > 0) {
		serverTab[0].innerText += ` (${addCommas(parseInt(servers.TotalCollectionSize))})`
	}
}

function formatTime(time) {
    suffix = " hr"
    if (time < 60) {
        suffix = " minute"
		if (time != 1) {
			suffix += "s"
		}
    } else {
		oldTime = time
        time = Math.floor(time / 60)
		if (time != 1) {
			suffix += "s"
		}
		if (time <= 99) {
			suffix += " " + (oldTime - (time * 60)) + " min"
			if ((oldTime - (time * 60)) != 1) {
				suffix += "s"
			}
		}
    }
    return time + suffix
}

function getDaysSince(date) {
    now = new Date().getTime()
    return Math.floor(Math.abs((date - now) / (24 * 60 * 60 * 1000)))
}

async function getTimePlayed(gameId, timePeriod) {
	playTime = await fetchPlayTime(gameId, timePeriod)
	if (playTime.length > 0) {
		time = playTime[0].time_played
	} else {
		time = 0
	}
	timePlayedCache = await getLocalStorage("timePlayed")
	if (typeof timePlayedCache == "undefined") {
        timePlayedCache = {}
    }
	if (gameId in timePlayedCache && getDaysSince(timePlayedCache[gameId][1]) <= timePeriod) {
		time += timePlayedCache[gameId][0]
	}
	return time
}

function createUpgradeModal() {
    modalDiv = document.createElement('div')
    modalDiv.setAttribute('id', 'standardUpgradeModal')
    modalDiv.setAttribute('class', 'upgrade-modal')
	modalDiv.style.zIndex = 100000
    modalHTML = `<div id="standardUpgradeModal" style="z-index:10000;display:block;" class="upgrade-modal"><div style="background-color:#232527;position:absolute;width:500px;height:500px;left:-webkit-calc(50% - 250px);top:-webkit-calc(50% - 250px);" class="modal-content upgrade-modal-content">
    <span style="margin-top:5px;margin-right:5px;font-size:40px;" class="upgrade-modal-close">×</span>
    <h2 style="padding-bottom:5px;border-bottom: 3px solid #FFFFFF;font-family:HCo Gotham SSm;color:white;font-size:30px;position:absolute;top:20px;left:40px;"><img style="width:70px;left:0px;" src="https://ropro.io/images/standard_icon.png"> Standard Tier Feature</h2><div style="font-family:HCo Gotham SSm;color:white;font-size:20px;position:absolute;top:115px;left:200px;width:270px;">Sorting your playtime by Month, Year, and All Time is only available for<br><b><img style="width:20px;margin-top:-3px;margin-right:3px;" src="https://ropro.io/images/standard_icon.png">RoPro Standard Tier+</b><br>subscribers.</div><div style="font-family:HCo Gotham SSm;color:white;font-size:18px;position:absolute;top:270px;left:200px;width:270px;"><u>More Subscription Benefits:</u>
    <ul style="margin-left:20px;font-size:12px;font-family:HCo Gotham SSm;">
    <li style="list-style-type:circle;">Fastest Server &amp; Server Size Sort</li>
    <li style="list-style-type:circle;">More Game Filters &amp; Like Ratio Filter</li><li style="list-style-type:circle;">Trade Value &amp; Demand Calculator</li><li style="list-style-type:circle;">Save Sandbox Outfits &amp; Use Bundles</li><li style="list-style-type:circle;">And many more! Find a full list <a style="text-decoration:underline;cursor:pointer;" href="https://ropro.io#standard" target="_blank">here</a>.</li></ul>
    </div><video width="70%" height="100%" style="pointer-events: none;position:absolute;top:10px;left:-70px;transform:scale(2);" src="" autoplay="" loop="" muted=""></video>
    <a href="https://ropro.io#standard" target="_blank"><button type="button" style="font-family:HCo Gotham SSm;position:absolute;left:25px;top:440px;width:450px;" class="btn-growth-sm PurchaseButton">Upgrade</button></a>
    </div></div>`
    modalDiv.innerHTML += modalHTML
    body = document.getElementsByTagName('body')[0]
    body.insertBefore(modalDiv, body.childNodes[0])
    $('.upgrade-modal-close').click(function(){
        document.getElementById('standardUpgradeModal').remove()
    })
}

function upgradeModal() {
    createUpgradeModal()
    document.getElementById('standardUpgradeModal').getElementsByTagName('video')[0].src = `https://ropro.io/dances/dance${(Math.floor(Math.random() * 18) + 1)}.webm`
    document.getElementById('standardUpgradeModal').style.display = "block"
}

async function updatePlayTime(gameId, timePeriod) {
	document.getElementById("playTimeText").innerHTML = '<span id="mostPlayedLoadingBar" style="position:absolute; top:-5px;left:40px; display: inline-block; transform: scale(0.5); width: 100px; height: 25px; visibility: initial !important;margin-right:50px;margin-top:0px;" class="spinner spinner-default"></span>'
	time = await getTimePlayed(gameId, timePeriod)
	document.getElementById("playTimeText").title = `${parseInt(time)} minutes`
	document.getElementById("playTimeText").innerText = formatTime(parseInt(time))
}

async function addPlayTime(gameId) {
	playTimeHTML = `<div style="margin-top:5px;font-size:12px;position:relative;" class="text-label">Played <img style="background-image:none;margin:0px;margin-top:-2px;margin-bottom:0px;transform:scale(1);border:none;margin-left:0px;margin-right:1px;width:15px;height:15px;" src="https://ropro.io/images/timer${theme == "dark" ? "_white" : "icon_light"}.png" class="info-label icon-pastname">
	<a href="#!/game-instances" style="font-size:13px;display:inline-block;" id="playTimeText" class="text-name" title=""><span id="mostPlayedLoadingBar" style="position:absolute; top:-5px;left:40px; display: inline-block; transform: scale(0.5); width: 100px; height: 25px; visibility: initial !important;margin-right:50px;margin-top:0px;" class="spinner spinner-default"></span></a><div id="timeDropdown" style="overflow:visible;margin-top:-10px;margin-left:0px;float:right;width:150px;transform:scale(0.8);margin-right:-37px;z-index:10;margin-bottom:0px;" class="input-group-btn group-dropdown">
	<button style="border:none;" type="button" class="input-dropdown-btn" data-toggle="dropdown" aria-expanded="false"> 
	<span style="float:right;" class="icon-down-16x16"></span><span id="timeLabel" class="rbx-selection-label ng-binding" ng-bind="layout.selectedTab.label" style="font-size:14px;float:right;margin-right:5px;">Past Week</span> 
	</button>
	<ul style="max-height:1000px;width:100px;margin-left:35px;" id="timeOptions" data-toggle="dropdown-menu" class="dropdown-menu" role="menu"> 
	<li>
	<a time="pastWeek" class="timeChoice">
		<span ng-bind="tab.label" class="ng-binding" style="font-size:14px;">Past Week</span>
	</a></li><li>
	<a time="pastMonth" class="timeChoice">
		<span style="font-size:14px;" ng-bind="tab.label" class="ng-binding">Past Month</span>
	</a></li><li>
	<a time="pastYear" class="timeChoice">
		<span style="font-size:14px;" ng-bind="tab.label" class="ng-binding">Past Year</span>
	</a></li><li>
	<a time="allTime" class="timeChoice">
		<span style="font-size:14px;" ng-bind="tab.label" class="ng-binding">All Time</span>
	</a></li></ul></div></div>`
	div = document.createElement('div')
	div.innerHTML = playTimeHTML
	titleContainer = document.getElementsByClassName('game-title-container')
	if (titleContainer.length > 0) {
		titleContainer[0].appendChild(div)
	}
	updatePlayTime(gameId, 7)
	var morePlaytimeSorts = await fetchSetting("morePlaytimeSorts")
	$('.timeChoice').click(function(){
		time = this.getAttribute("time")
		if (time == "pastWeek") {
			document.getElementById('timeLabel').innerText = "Past Week"
			updatePlayTime(gameId, 7)
		} else if (time == "pastMonth") {
			if (morePlaytimeSorts) {
				document.getElementById('timeLabel').innerText = "Past Month"
				updatePlayTime(gameId, 30)
			} else {
				upgradeModal()
			}
		} else if (time == "pastYear") {
			if (morePlaytimeSorts) {
				document.getElementById('timeLabel').innerText = "Past Year"
				updatePlayTime(gameId, 365)
			} else {
				upgradeModal()
			}
		} else if (time == "allTime") {
			if (morePlaytimeSorts) {
				document.getElementById('timeLabel').innerText = "All Time"
				updatePlayTime(gameId, 365)
			} else {
				upgradeModal()
			}
		}
	})
}

function addRecentServer(universeId) {
	friendServers = document.getElementById('rbx-friends-running-games')
	if (friendServers != null) {
		mostRecentServerDiv = document.createElement('div')
		mostRecentServerDiv.innerHTML = mostRecentServerHTML
		friendServers.parentNode.insertBefore(mostRecentServerDiv, friendServers)
	}
	$(".rbx-refresh").click(function(){
		loadMostRecentServer(universeId)
	})
}

function addGamecodesTips(universeId) {
	gamecodesTipsButtonHTML = `<li id="tab-gamecodes" class="rbx-tab tab-gamecodes"><a class="rbx-tab-heading" href="#gamecodes"> <span class="text-lead">Gamecodes & Tips</span></a></li>`
	gamecodesTipsButton = document.createElement('div')
	gamecodesTipsButton.innerHTML = gamecodesTipsButtonHTML
	gamecodesTipsButton = gamecodesTipsButton.childNodes[0]
	gamecodesTipsPane = document.createElement('div')
	gamecodesTipsPane.innerHTML = gamecodesTipsPaneHTML
	gamecodesTipsPane = gamecodesTipsPane.childNodes[0]
	document.getElementsByClassName('nav nav-tabs')[0].insertBefore(gamecodesTipsButton, document.getElementsByClassName('nav nav-tabs')[0].childNodes[1])
	document.getElementsByClassName('tab-content rbx-tab-content')[0].appendChild(gamecodesTipsPane)
	$('.page-content .rbx-tabs-horizontal .rbx-tab').css('width', '25%')
	$('.page-content .rbx-tabs-horizontal .rbx-tab').click(function() {
		if (this == gamecodesTipsButton) {
			$('.page-content .rbx-tabs-horizontal .rbx-tab').removeClass('active')
			gamecodesTipsButton.classList.add('active')
			$('.tab-pane').css('display', 'none')
			$('.tab-pane.gamecodes').css('display', 'block')
		} else {
			console.log(this)
			gamecodesTipsButton.classList.remove('active')
			$('.tab-pane').css('display', 'none')
			$('#' + stripTags(this.id.split('tab-')[1])).css('display', 'block')
		}
	})
}

async function loadMostRecentServer(universeId) { //Check if recent server is still active before displaying it to user, otherwise remove it from recent server cache.
	mostRecentServers = await getLocalStorage("mostRecentServers")
	if (universeId in mostRecentServers) {
		var serverStatus = new XMLHttpRequest();
		serverStatus.open("GET", `https://assetgame.roblox.com/Game/PlaceLauncher.ashx?request=RequestGameJob&placeId=${mostRecentServers[universeId][0]}&gameId=${mostRecentServers[universeId][1]}`, true);
		serverStatus.withCredentials = true;
		serverStatus.send();
		serverStatus.onreadystatechange = function() {
			if (serverStatus.readyState === 4) {
			  var status = JSON.parse(serverStatus.responseText);
				if (serverStatus.status === 200) {
					if (status.jobId != null) { //Server is still active - display it in recent server box.
						addMostRecentServer(mostRecentServers[universeId][0], mostRecentServers[universeId][1], mostRecentServers[universeId][2], mostRecentServers[universeId][3], true)
					} else { //Server is now inactive - remove it from recent.
						addMostRecentServer(mostRecentServers[universeId][0], mostRecentServers[universeId][1], mostRecentServers[universeId][2], mostRecentServers[universeId][3], false)
						/**delete mostRecentServers[universeId]
						setLocalStorage("mostRecentServers", mostRecentServers)
						document.getElementById('rbx-recent-server-box').innerHTML = `<p class="no-servers-message">No Active Recent Server Found.</p>`**/
					}
				}
			}
		  }
	}
}

function addMostRecentServer(placeID, serverID, userID, time, serverActive) {
	timeSince = Math.round(new Date().getTime() - parseInt(time)) / 1000
	if (timeSince < 60) { //seconds
		period = Math.round(timeSince)
		suffix = period == 1 ? "" : "s"
		timeString = `Now`
	} else if (timeSince / 60 < 60) { //minutes
		period = Math.round(timeSince / 60)
		if (timeSince / 60 > 1.25) {
			suffix = period == 1 ? "" : "s"
			timeString = `${period} minute${suffix} ago`
		} else {
			timeString = `Now`
		}
	} else if (timeSince / 60 / 60 < 24) { //hours
		period = Math.round(timeSince / 60 / 60)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} hour${suffix} ago`
	} else if (timeSince / 60 / 60 / 24 < 30) { //days
		period = Math.round(timeSince / 60 / 60 / 24)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} day${suffix} ago`
	} else { //months
		period = Math.round(timeSince / 60 / 60 / 24 / 30)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} month${suffix} ago`
	}
	if (serverActive) {
		document.getElementById('rbx-recent-server-box').innerHTML = `<li style="border-radius:15px;margin-top:-15px;" class="stack-row rbx-game-server-item"><div class="section-header"><div class="link-menu rbx-game-server-menu"></div></div><div style="width:90%;" class="section-left rbx-game-server-details">
		<div style="float:left;" class="text-info rbx-game-status rbx-game-server-status"><b>Last Played:</b><img style="background-image:none;margin:0px;margin-top:-2px;margin-bottom:1px;transform:scale(1);border:none;margin-left:5px;margin-right:5px;width:15px;height:15px;" src="https://ropro.io/images/timer${theme == "dark" ? "_white" : "icon_light"}.png" class="info-label icon-pastname">${stripTags(timeString)}</div><br><div style="float:left;" class="text-info rbx-game-status rbx-game-server-status"><b>Server ID:</b> ${stripTags(serverID)}</div>
		<div class="rbx-game-server-alert hidden"><span class="icon-remove"></span>Slow Game</div><a class="btn-full-width btn-control-xs rbx-game-server-join" data-placeid="${parseInt(placeID)}" onclick="Roblox.GameLauncher.joinGameInstance(${parseInt(placeID)}, &quot;${stripTags(serverID)}&quot;)">Rejoin Server</a></div><div style="width:9%;margin-top:13px;margin-left:1%;" class="section-right rbx-game-server-players"><span style="transform:scale(1.3);" class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img style="background-color:#0F8CE0" src="https://www.roblox.com/headshot-thumbnail/image?userId=${parseInt(userID)}&width=420&height=420&format=png" class="avatar-card-image"></a></span></div></li>`	
	} else {
		document.getElementById('rbx-recent-server-box').innerHTML = `<li style="border-radius:15px;margin-top:-15px;" class="stack-row rbx-game-server-item"><div class="section-header"><div class="link-menu rbx-game-server-menu"></div></div><div style="width:90%;" class="section-left rbx-game-server-details">
		<div style="float:left;" class="text-info rbx-game-status rbx-game-server-status"><b>Last Played:</b><img style="background-image:none;margin:0px;margin-top:-2px;margin-bottom:1px;transform:scale(1);border:none;margin-left:5px;margin-right:5px;width:15px;height:15px;" src="https://ropro.io/images/timer${theme == "dark" ? "_white" : "icon_light"}.png" class="info-label icon-pastname">${stripTags(timeString)}</div><br><div style="float:left;" class="text-info rbx-game-status rbx-game-server-status"><b>Server ID:</b> ${stripTags(serverID)}</div>
		<div class="rbx-game-server-alert hidden"><span class="icon-remove"></span>Slow Game</div><a class="btn-full-width btn-control-xs rbx-game-server-join" data-placeid="${parseInt(placeID)}" onclick="Roblox.GameLauncher.joinGameInstance(${parseInt(placeID)}, &quot;${stripTags(serverID)}&quot;)">Server No Longer Active</a></div><div style="width:9%;margin-top:13px;margin-left:1%;" class="section-right rbx-game-server-players"><span style="transform:scale(1.3);" class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img style="background-color:#393B3D" src="https://www.roblox.com/headshot-thumbnail/image?userId=${parseInt(userID)}&width=420&height=420&format=png" class="avatar-card-image"></a></span></div></li>`	
	}
}

function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

var gamecodesTips = false

async function checkGamePage() {
	if (window.location.href.includes("games/")) {
		gameSplit = window.location.href.split("games/")[1]
	} else {
		gameSplit = window.location.href.split("discover/")[1]
	}
	if (typeof gameSplit != 'undefined') {
		globalGameId = gameSplit.split("/")[0]
		if (isNormalInteger(globalGameId)) { // Valid Game Page
			universeId = document.getElementById('game-detail-meta-data').getAttribute('data-universe-id')
			addEmbeds(document.getElementById('game-detail-page'), universeId)
			gameInfo = await fetchGameInfo(universeId)
			addMaxPlayers(gameInfo.data[0].maxPlayers)
			//addSearchBar(gameId)
			if (await fetchSetting("liveLikeDislikeFavoriteCounters")) {
				liveCounters()
			}
			livePlaying()
			if (await fetchSetting("activeServerCount")) {
				addActiveServerCount(globalGameId)
			}
			if (await fetchSetting("playtimeTracking")) {
				addPlayTime(parseInt(universeId))
			}
			mostRecentServer = true
			if (await fetchSetting("mostRecentServer")) {
				addRecentServer(parseInt(universeId))
				loadMostRecentServer(universeId)
			}
			setInterval(function(){
				if (mostRecentServer) {
					loadMostRecentServer(universeId)
				}
			}, 120000)
			//if (gamecodesTips) {
			//	addGamecodesTips(universeId)
			//}
			//addRandomServerButton()
		}
	}
}
checkGamePage()
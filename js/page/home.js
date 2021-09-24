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

mostPlayedHTML = `<div id="scrollLeft" style="margin-top:33px;height:95px;margin-left:6px;width:20px;" class="scroller prev disabled" role="button" aria-hidden="true"><div class="arrow"><span style="transform:scale(0.8);margin-left:-4px;" class="icon-games-carousel-left"></span></div></div>
<div class="container-header games-filter-changer">
<h3 style="font-size:17px;margin-top:2px;margin-bottom:-10px;position:absolute;">Your Most Played<img src="https://ropro.io/images/ropro_logo_small.png" style="filter: drop-shadow(1px 1px 1px #363636);width:35px;margin-left:5px;margin-bottom:2px;"></h3>
<div id="timeDropdown" style="overflow:visible;margin-top:-2px;margin-left:10px;float:right;width:150px;transform:scale(0.8);margin-right:-12px;z-index:10;margin-bottom:-10px;" class="input-group-btn group-dropdown">
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
</a></li></ul></div></div>
<ul style="overflow:hidden;" id="mostPlayedContainer" class="hlist game-cards">
<span id="mostPlayedLoadingBar" style="float: right; display: inline-block; transform: scale(0.8); width: 200px; height: 25px; visibility: initial !important;margin-right:100px;margin-top:35px;" class="spinner spinner-default"></span>
</ul>
<div id="scrollRight" style="margin-top:33px;height:95px;margin-right:15px;width:20px;" class="scroller next disabled" role="button" aria-hidden="true"><div style="transform:scale(0.8);margin-right:-9px;" class="arrow"><span class="icon-games-carousel-right"></span></div></div>`

function fetchMostPlayed(time) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getMostPlayedUniverse.php?time=" + time}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchGameDetails(placeIds) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/multiget-place-details?placeIds=" + placeIds.join("&placeIds=")}, 
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

function fetchUser() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://users.roblox.com/v1/users/authenticated"}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchPremium(userId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://premiumfeatures.roblox.com/v1/users/"+userId+"/validate-membership"}, 
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

function getLocalStorage(key) {
	return new Promise(resolve => {
		chrome.storage.local.get(key, function (obj) {
			resolve(obj[key])
		})
	})
}

function getStorage(key) {
	return new Promise(resolve => {
		chrome.storage.sync.get(key, function (obj) {
			resolve(obj[key])
		})
	})
}

function setStorage(key, value) {
	return new Promise(resolve => {
		chrome.storage.sync.set({[key]: value}, function(){
			resolve()
		})
	})
}


function formatTime(time) {
    suffix = " hour"
    if (time < 60) {
        suffix = " minute"
    } else {
        time = Math.floor(time / 60)
    }
    if (time != 1) {
        suffix += "s"
    }
    return time + suffix
}

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
}

function addGame(name, id, url, thumbnail, time) {
    gameHTML = `<div class="game-card-container"><a class="game-card-link" href="${stripTags(url)}" id="${parseInt(id)}">
    <div class="game-card-thumb-container" style="width:90px;height:90px;"><div style="width:90px;height:90px;" class="game-card-thumb">
    <span class="thumbnail-2d-container"><img style="width:90px;height:90px;" class="game-card-thumb" src="${stripTags(thumbnail)}" alt="${stripTags(name)}" title="${stripTags(name)}"></span>
    </div></div><div style="margin-top:-3px;font-size:12px;padding:0px;text-overflow: ellipsis;white-space: nowrap;" class="game-card-name game-name-title" title="${stripTags(name)}">${stripTags(name)}</div><div style="margin-top:-5px;" class="game-card-info">
    <img style="background-image:none;margin:-6px;margin-top:0px;margin-bottom:0.5px;transform:scale(0.4);border:none;margin-left:-8px;margin-right:-5px;margin-top:-0.6px;" src="https://ropro.io/images/timericon_${theme}.png" class="info-label icon-pastname"><span style="padding:0px;font-size:10.5px;" title="Played for ${parseInt(time)} minutes" class="info-label vote-percentage-label">${formatTime(time)}</span>
    </div></a></div>`
    li = document.createElement('li')
    li.setAttribute("style", "height:120px;width:100px;")
    li.setAttribute("class", "list-item game-card game-tile")
    li.setAttribute("title", stripTags(name))
    li.innerHTML = gameHTML
    document.getElementById("mostPlayedContainer").appendChild(li)
    return li
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

function getDaysSince(date) {
    now = new Date().getTime()
    return Math.floor(Math.abs((date - now) / (24 * 60 * 60 * 1000)))
}

var page = 0
var pages = [[]]

async function renderMostPlayed(time) {
    if (await fetchSetting("playtimeTracking")) {
        page = 0
        pages = [[]]
        timePlayed = await getLocalStorage("timePlayed")
        if (typeof timePlayed == "undefined") {
            timePlayed = {}
        }
        mostPlayed = await fetchMostPlayed(time)
        console.log(mostPlayed)
        for (i = 0; i < mostPlayed.length; i++) {
            game = mostPlayed[i]
            gameId = parseInt(game.id)
            if (gameId in timePlayed) {
                if (getDaysSince(timePlayed[gameId][1]) > time) {
                    timePlayed[gameId][0] = 0
                }
                timePlayed[gameId] = [timePlayed[gameId][0] + game.time_played, new Date().getTime(), true]
            } else {
                timePlayed[gameId] = [game.time_played, new Date().getTime(), true]
            }
        }
        for (key in timePlayed) {
            if (getDaysSince(timePlayed[key][1]) > time) {
                delete timePlayed[key]
            }
        }
        playTimes = Object.keys(timePlayed).filter(function(key) { return timePlayed[key].length == 3 ? true : false }).map(function(key) {
            return [key, timePlayed[key][0]];
        });
        console.log(playTimes)
        playTimes.sort(function(first, second) {
            return second[1] - first[1];
        });
        playTimes = playTimes.slice(0, 24)
        universeIds = []
        for (i = 0; i < playTimes.length; i++) {
            universeIds.push(playTimes[i][0])
        }
        gameDetails = await fetchUniverseDetails(universeIds)
        console.log(gameDetails, universeIds)
        gameDetails = gameDetails.data
        gameIcons = await fetchGameIcons(universeIds)
        document.getElementById("mostPlayedContainer").innerHTML = ""
        icons = {}
        for (i = 0; i < gameIcons.data.length; i++) {
            icons[gameIcons.data[i].targetId] = gameIcons.data[i].imageUrl
        }
        if (universeIds.length > 4) {
            document.getElementById('scrollRight').style.display = "block";
            document.getElementById('scrollLeft').style.display = "block";
            document.getElementById('scrollLeft').classList.add("disabled")
            document.getElementById('scrollRight').classList.remove("disabled")
        } else {
            document.getElementById('scrollRight').style.display = "block";
            document.getElementById('scrollLeft').style.display = "block";
        }
        for (i = 0; i < gameDetails.length; i++) {
            game = gameDetails[i]
            if (pages[pages.length - 1].length >= 4) {
                pages.push([])
            }
            gameCard = addGame(game.name, game.rootPlaceId, "https://www.roblox.com/games/" + game.rootPlaceId, icons[game.id], timePlayed[game.id][0])
            if (pages.length > 1) {
                gameCard.style.display = "none"
            }
            pages[pages.length - 1].push(gameCard)
        }
        console.log(pages)
    } else {
        enableHTML = `<div style="text-align:center;font-size:14px;margin-top:-3px;"><span style="font-size:12px;margin-top:-8px;">RoPro will keep track of the games you spend<br>the most time playing, and show them here!<br>(This feature is disabled by default.)</span><br><li class="rbx-upgrade-now" style="margin-top:5px;display: inline-block;"><a class="btn-growth-md btn-secondary-md" id="enablePlaytimeTracking">Enable RoPro Playtime Tracking</a></li><p style="margin-top:3px;font-size:10px;">
        You can toggle this feature in the RoPro Settings.</p></div>`
        document.getElementById("mostPlayedContainer").innerHTML = enableHTML
        document.getElementById('enablePlaytimeTracking').addEventListener('click', async function(){
            rpSettings = await getStorage("rpSettings")
            rpSettings['playtimeTracking'] = true
            await setStorage('rpSettings', rpSettings)
            window.location.reload()
        })
    }
}

async function mainHome() {
    if (await fetchSetting("mostPlayedGames")) {
        div = document.createElement('div')
        div.setAttribute("style", "height:150px;margin-left:auto;width:400px;display:inline-block;float:right;margin-right:0px;position:relative;min-width:380px;")
        div.innerHTML = mostPlayedHTML
        if (document.getElementsByClassName('home-header').length > 0) {
            document.getElementsByClassName('home-header')[0].appendChild(div)
        } else {
            currentuser = await fetchUser()
            premiumuser = await fetchPremium(currentuser.id)
            if (!premiumuser) {
                premium = ''
            } else {
                premium = `<span style="margin-right:5px;margin-top:-6px;" class="icon-premium-medium"></span>`
            }
            document.getElementsByClassName('home-container')[0].getElementsByClassName('container-header')[0].appendChild(div)
            div.setAttribute("style", stripTags(div.getAttribute("style"))+"margin-top:-60px;")
            //$(document).ready(function() {
                if (document.getElementsByClassName('home-header').length == 0) {
                    username = stripTags(currentuser.name)
                    usericon = `https://www.roblox.com/headshot-thumbnail/image?userId=${parseInt(currentuser.id)}&width=420&height=420&format=png`
                    newHomeText = `<span>Welcome Home,</span><br><img class="avatar avatar-headshot-xs active" src="${stripTags(usericon)}" style="width:70px;height:auto;margin-top:0px;margin-left:5px;margin-right:5px;" id="myGlower"><h1 style="margin-bottom:7px;display:inline-block;">${premium}${stripTags(username)}</h1>`
                    document.getElementsByClassName('home-container')[0].getElementsByTagName('h1')[0].style.height = "50px"
                    document.getElementsByClassName('home-container')[0].getElementsByTagName('h1')[0].innerHTML = newHomeText
                }
            //})
        }
        renderMostPlayed(7)
        document.getElementById('scrollLeft').addEventListener('click', (event) => {
            if (page > 0) {
                for (i = 0; i < pages[page].length; i++) {
                    pages[page][i].style.display = "none"
                }
                page = page - 1
                for (i = 0; i < pages[page].length; i++) {
                    pages[page][i].style.display = "inline-block"
                }
                if (page == 0) {
                    document.getElementById('scrollLeft').classList.add("disabled")
                }
                if (page >= 0) {
                    document.getElementById('scrollRight').classList.remove("disabled")
                }
            }
        })
        document.getElementById('scrollRight').addEventListener('click', (event) => {
            if (page < pages.length - 1) {
                for (i = 0; i < pages[page].length; i++) {
                    pages[page][i].style.display = "none"
                }
                page = page + 1
                for (i = 0; i < pages[page].length; i++) {
                    pages[page][i].style.display = "inline-block"
                }
                if (page == pages.length - 1) {
                    document.getElementById('scrollRight').classList.add("disabled")
                }
                if (page <= pages.length - 1) {
                    document.getElementById('scrollLeft').classList.remove("disabled")
                }
            }
        })
        morePlaytimeSorts = await fetchSetting("morePlaytimeSorts")
        $('.timeChoice').click(function(){
            time = this.getAttribute("time")
            if (time == "pastWeek") {
                document.getElementById('timeLabel').innerText = "Past Week"
                document.getElementById('mostPlayedContainer').innerHTML = '<span id="mostPlayedLoadingBar" style="float: right; display: inline-block; transform: scale(0.8); width: 200px; height: 25px; visibility: initial !important;margin-right:100px;margin-top:35px;" class="spinner spinner-default"></span>'
                renderMostPlayed(7)
            } else if (time == "pastMonth") {
                if (morePlaytimeSorts) {
                    document.getElementById('timeLabel').innerText = "Past Month"
                    document.getElementById('mostPlayedContainer').innerHTML = '<span id="mostPlayedLoadingBar" style="float: right; display: inline-block; transform: scale(0.8); width: 200px; height: 25px; visibility: initial !important;margin-right:100px;margin-top:35px;" class="spinner spinner-default"></span>'
                    renderMostPlayed(30)
                } else {
                    upgradeModal()
                }
            } else if (time == "pastYear") {
                if (morePlaytimeSorts) {
                    document.getElementById('timeLabel').innerText = "Past Year"
                    document.getElementById('mostPlayedContainer').innerHTML = '<span id="mostPlayedLoadingBar" style="float: right; display: inline-block; transform: scale(0.8); width: 200px; height: 25px; visibility: initial !important;margin-right:100px;margin-top:35px;" class="spinner spinner-default"></span>'
                    renderMostPlayed(365)
                } else {
                    upgradeModal()
                }
            } else if (time == "allTime") {
                if (morePlaytimeSorts) {
                    document.getElementById('timeLabel').innerText = "All Time"
                    document.getElementById('mostPlayedContainer').innerHTML = '<span id="mostPlayedLoadingBar" style="float: right; display: inline-block; transform: scale(0.8); width: 200px; height: 25px; visibility: initial !important;margin-right:100px;margin-top:35px;" class="spinner spinner-default"></span>'
                    renderMostPlayed(999)
                } else {
                    upgradeModal()
                }
            }
        })
    }
}

var checkCount = 0

function checkLoad() {
	if ((document.getElementById('HomeContainer') != null && (document.getElementsByClassName('container-header').length > 0 || document.getElementsByClassName('home-header').length > 0)) || checkCount > 15) {
        console.log(document.getElementsByClassName('container-header').length, document.getElementsByClassName('home-header').length)
        mainHome()
	} else {
        console.log(document.getElementsByClassName('container-header').length, document.getElementsByClassName('home-header').length)
		checkCount++
		setTimeout(function(){
			checkLoad()
		}, 500)
	}
}
checkLoad()
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

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse)
{
	switch(request.greeting) {
		case "GetURL":
			if (request.url.includes("ropro.io")) {
				$.post(request.url, function(data) {
					sendResponse(data);
				}).fail(function() {
					sendResponse("ERROR")
				})
			} else {
				$.get(request.url, function(data) {
					sendResponse(data);
				}).fail(function() {
					sendResponse("ERROR")
				})
			}
			break;
		case "PostURL":
			$.ajax({
				url: request.url,
				type: "POST",
				data: request.jsonData,
				success: function(data) {
					sendResponse(data);
				}
			})
			break;
		case "PostValidatedURL":
			$.ajax({
				url: request.url,
				type: "POST",
				headers: {"X-CSRF-TOKEN": myToken},
				contentType: 'application/json',
				data: request.jsonData,
				success: function(data) {
					if (!("errors" in data)) {
						sendResponse(data);
					} else {
						sendResponse(null)
					}
				}
			}).fail(async function(){
				console.log("TOKEN FAILED, FETCHING NEW TOKEN")
				myToken = await loadToken()
				$.ajax({
					url: request.url,
					type: "POST",
					headers: {"X-CSRF-TOKEN": myToken},
					contentType: 'application/json',
					data: request.jsonData,
					success: function(data) {
						if (!("errors" in data)) {
							sendResponse(data);
						} else {
							sendResponse(null)
						}
					}
				}).fail(function(){
					console.log("TOKEN FAILED AGAIN, PERFORMING BACKUP TOKEN FETCH")
					$.post('https://catalog.roblox.com/v1/catalog/items/details').fail(function(r,e,s){
						token = r.getResponseHeader('x-csrf-token')
						myToken = token
						chrome.storage.sync.set({'token': token})
						console.log("New Token: " + token)
						$.ajax({
							url: request.url,
							type: "POST",
							headers: {"X-CSRF-TOKEN": myToken},
							contentType: 'application/json',
							data: request.jsonData,
							success: function(data) {
								if (!("errors" in data)) {
									sendResponse(data);
								} else {
									sendResponse(null)
								}
							}
						})
					})
				})
			})
			break;
		case "GetStatusCode": 
			$.get({url: request.url}).always(function(r, e, s){
				sendResponse(r.status)
			})
			break;
		case "ValidateLicense":
			subscriptionManager.validateLicense()
			tradeNotifierInitialized = false
			break;
		case "DeclineTrade": 
			$.post({url: 'https://trades.roblox.com/v1/trades/' + parseInt(request.tradeId) + '/decline', headers: {'X-CSRF-TOKEN': myToken}}, function(data,error,res) {
				sendResponse(res.status)
			}).fail(function(r, e, s){
				if (r.status == 403) {
					$.post({url: 'https://trades.roblox.com/v1/trades/' + parseInt(request.tradeId) + '/decline', headers: {'X-CSRF-TOKEN' : r.getResponseHeader('x-csrf-token')}}, function(data,error,res) {
						sendResponse(r.status)
					})
				} else {
					sendResponse(r.status)
				}
			})
			break;
		case "GetUserID":
			$.get('https://www.roblox.com/mobileapi/userinfo', function(data,error,res) {
				sendResponse(data['UserID'])
			})
			break;
		case "GetCachedTrades":
			sendResponse(inboundsCache)
			break;
		case "DoCacheTrade":
			function loadInbound(id) {
				if (id in inboundsCache && inboundsCache[id] != null) {
					sendResponse([inboundsCache[id], 1])
				} else {
					$.get('https://trades.roblox.com/v1/trades/' + id, function(data) {
						console.log(data)
						inboundsCache[data.id] = data
						sendResponse([data, 0])
					}).fail(function(r, e, s) {
						sendResponse(r.status)
					})
				}
            }
            loadInbound(request.tradeId)
			break;
		case "GetUsername":
			async function getUsername(){
				username = await getStorage("rpUsername")
				sendResponse(username)
			}
			getUsername()
			break;
		case "GetUserInventory":
				async function getInventory(){
					inventory = await loadInventory(request.userID)
					sendResponse(inventory)
				}
				getInventory()
				break;
		case "GetUserLimitedInventory":
			async function getLimitedInventory(){
				inventory = await loadLimitedInventory(request.userID)
				sendResponse(inventory)
			}
			getLimitedInventory()
			break;
		case "GetUserServer":
				async function getServer(){
					server = await serverSearch(request.username, request.gameID)
					sendResponse(server)
				}
				getServer()
				break;
		case "GetMaxPlayerIndex":
				async function getIndex(){
					index = await maxPlayerCount(request.gameID, request.count)
					sendResponse(index)
				}
				getIndex()
				break;
		case "GetLowPingServers":
				async function getServerList(){
					serverList = await lowPingServers(request.gameID, request.startIndex, request.maxServers)
					sendResponse(serverList)
				}
				getServerList()
				break;
		case "GetRandomServer":
				async function getRandomServer(){
					randomServerElement = await randomServer(request.gameID)
					sendResponse(randomServerElement)
				}
				getRandomServer()
				break;
		case "GetSetting":
			async function getSettings(){
				setting = await loadSettings(request.setting)
				sendResponse(setting)
			}
			getSettings()
			break;
		case "GetTrades":
			async function getTradesType(type){
				tradesType = await loadTradesType(type)
				sendResponse(tradesType)
			}
			getTradesType(request.type)
			break;
		case "GetTradesData":
				async function getTradesData(type){
					tradesData = await loadTradesData(type)
					sendResponse(tradesData)
				}
				getTradesData(request.type)
				break;
		case "GetSettingValidity":
			async function getSettingValidity(){
				valid = await loadSettingValidity(request.setting)
				sendResponse(valid)
			}
			getSettingValidity()
			break;
		case "SyncSettings":
			syncSettings()
			setTimeout(function(){
				sendResponse("sync")
			}, 500)
			break;
		case "OpenOptions":
			chrome.tabs.create({url: chrome.extension.getURL('/options.html')})
			break;
		case "GetSubscription":
			async function doGetSubscription() {
				subscription = await getStorage("rpSubscription")
				sendResponse("ultra_tier")
			}
			doGetSubscription()
			break;
		case "DeclineBots":
			async function doDeclineBots() {
				tradesDeclined = await declineBots()
				sendResponse(tradesDeclined)
			}
			doDeclineBots()
			break;
		case "GetMutualFriends":
			async function doGetMutualFriends(){
				mutuals = await mutualFriends(request.userID)
				sendResponse(mutuals)
			}
			doGetMutualFriends()
			break;
		case "GetMutualFollowers":
			async function doGetMutualFollowers(){
				mutuals = await mutualFollowers(request.userID)
				sendResponse(mutuals)
			}
			doGetMutualFollowers()
			break;
		case "GetMutualFollowing":
			async function doGetMutualFollowing(){
				mutuals = await mutualFollowing(request.userID)
				sendResponse(mutuals)
			}
			doGetMutualFollowing()
			break;
		case "GetMutualFavorites":
			async function doGetMutualFavorites(){
				mutuals = await mutualFavorites(request.userID, request.assetType)
				sendResponse(mutuals)
			}
			doGetMutualFavorites()
			break;
		case "GetMutualBadges":
			async function doGetMutualBadges(){
				mutuals = await mutualFavorites(request.userID, request.assetType)
				sendResponse(mutuals)
			}
			doGetMutualBadges()
			break;
		case "GetMutualGroups":
			async function doGetMutualGroups(){
				mutuals = await mutualGroups(request.userID)
				sendResponse(mutuals)
			}
			doGetMutualGroups()
			break;
		case "GetMutualLimiteds":
			async function doGetMutualLimiteds(){
				mutuals = await mutualLimiteds(request.userID)
				sendResponse(mutuals)
			}
			doGetMutualLimiteds()
			break;
		case "GetMutualItems":
			async function doGetMutualItems(){
				mutuals = await mutualItems(request.userID)
				sendResponse(mutuals)
			}
			doGetMutualItems()
			break;
		case "CreateInviteTab":
			chrome.tabs.create({url: 'https://roblox.com/games/' + parseInt(request.placeid), active: false}, function(tab) {
				chrome.tabs.onUpdated.addListener(function tempListener (tabId , info) {
					if (tabId == tab.id && info.status === 'complete') {
						chrome.tabs.sendMessage(
							tabId,
							{type: "invite", key: request.key}
						  )
						chrome.tabs.onUpdated.removeListener(tempListener);
						setTimeout(function() {
							sendResponse(tab)
						}, 2000)
					}
				});
			})
			break;
	}

	return true;
})

var disabledFeatures = "";

$.get("https://ropro.io/api/disabledFeatures.php", function(data) {
		disabledFeatures = data
})

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

var defaultSettings = {
	buyButton: true,
	comments: true,
	dealCalculations: "rap",
	dealNotifier: true,
	embeddedRolimonsItemLink: true,
	embeddedRolimonsUserLink: true,
	fastestServersSort: true,
	gameLikeRatioFilter: true,
	gameTwitter: true,
	genreFilters: true,
	groupDiscord: true,
	groupRank: true,
	groupTwitter: true,
	itemPageValueDemand: true,
	linkedDiscord: true,
	liveLikeDislikeFavoriteCounters: true,
	livePlayers: true,
	liveVisits: true,
	moreGameFilters: true,
	serverInviteLinks: true,
	mostRecentServer: true,
	randomServer: true,
	tradeAge: true,
	notificationThreshold: 30,
	itemInfoCard: true,
	ownerHistory: true,
	profileThemes: true,
	profileStatus: true,
	profileValue: true,
	projectedWarningItemPage: true,
	quickItemSearch: true,
	quickTradeResellers: true,
	hideSerials: true,
	quickUserSearch: true,
	randomGame: true,
	popularToday: true,
	upcomingItems: true,
	reputation: true,
	reputationVote: true,
	sandbox: true,
	sandboxOutfits: true,
	serverSizeSort: true,
	singleSessionMode: false,
	tradeDemandRatingCalculator: true,
	tradeItemDemand: true,
	tradeItemValue: true,
	tradeNotifier: true,
	tradeOffersPage: true,
	tradeOffersSection: true,
	tradeOffersValueCalculator: true,
	tradePageProjectedWarning: true,
	tradePreviews: true,
	tradeProtection: true,
	tradeValueCalculator: true,
	moreTradePanel: true,
	valueThreshold: 0,
	hideTradeBots: true,
	autoDeclineTradeBots: true,
	hideDeclinedNotifications: true,
	hideOutboundNotifications: false,
	tradePanel: true,
	quickDecline: true,
	quickCancel: true,
	roproIcon: true,
	underOverRAP: true,
	winLossDisplay: true,
	mostPlayedGames: true,
	avatarEditorChanges: true,
	playtimeTracking: true,
	activeServerCount: true,
	morePlaytimeSorts: true,
	roproBadge: true,
	mutualFriends: true,
	moreMutuals: true
}

async function initializeSettings() {
	return new Promise(resolve => {
		async function checkSettings() {
			initialSettings = await getStorage('rpSettings')
			if (typeof initialSettings === "undefined") {
				await setStorage("rpSettings", defaultSettings)
				resolve()
			} else {
				changed = false
				for (key in Object.keys(defaultSettings)) {
					settingKey = Object.keys(defaultSettings)[key]
					if (!(settingKey in initialSettings)) {
						initialSettings[settingKey] = defaultSettings[settingKey]
						changed = true
					}
				}
				if (changed) {
					console.log("SETTINGS UPDATED")
					await setStorage("rpSettings", initialSettings)
				}
			}
		}
		checkSettings()
	})
}
initializeSettings()

async function maxPlayerCount(gameID, count) {
	if(await loadSettings("serverSizeSort")) {
		return new Promise(resolve => {
			$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=0", function(data){
				var i = 0;
				var j = data.TotalCollectionSize;
				var done = false;
				var closest = 9999;
				var closestIndex = 0;
				var lastIndex = -1;
				for (k = 0; k < data.Collection.length; k++) {
					if (data.Collection[k].CurrentPlayers.length <= count) {
						resolve(k)
					}
				}
				function getServer(index) { //Binary search algorithm to search servers by max player count - O(log(n))
					if (index == lastIndex) {
						resolve(closestIndex)
					} else {
						lastIndex = index
						$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + index, function(data){
							min = 9999
							if (data.Collection.length > 0) {
								for (k = 0; k < data.Collection.length; k++) {
									collection = data.Collection[k]
									if (Math.abs((collection.CurrentPlayers.length - count)) < closest) {
										closest = Math.abs((collection.CurrentPlayers.length - count))
										closestIndex = index + k + 1
									}
									if (collection.CurrentPlayers.length == count) {
										resolve(index + k)
										done = true
									} else {
										min = Math.min(collection.CurrentPlayers.length, min)
									}
								}
							}
							if (done == false) {
								if (min == 9999 || min < count) { //Gotta check larger servers
									j = index
									if (j - 1 > i) {
										getServer(Math.floor((j + i) / 2) + 1)
									} else {
										resolve(closestIndex)
									}
								} else { //Gotta check smaller servers
									i = index
									if (i + 1 < j) {
										getServer(Math.floor((j + i) / 2) - 1)
									} else {
										resolve(closestIndex)
									}
								}
							}
						})
					}
				}
				getServer(Math.floor((j + i) / 2))
			})
		})
	} else {
		return 0
	}
}

async function lowPingServers(gameID, startIndex, maxServers) {
	if(await loadSettings("fastestServersSort")) {
		return new Promise(resolve => {
				var serverArray = []
				function quicksortServer(array) { //Quicksort implementation for sorting servers by ping - O(n*log(n))
				
					function partition(low, high) {
						var pivot = array[low];
						var i = low;
						var j = high;
						var temp;
						while (i < j) {
							do {
								i++;
							} while(i < array.length && array[i].Ping <= pivot.Ping);
							do {
								j--;
							} while(j >= 0 && array[j].Ping > pivot.Ping);
							if (i < j) { //Swap the two values if i hasn't yet passed j
								temp = array[i];
								array[i] = array[j];
								array[j] = temp;
							}
						}
						temp = array[low]; //i has passed j, swap to get new pivot
						array[low] = array[j];
						array[j] = temp;
						return j; //new pivot
					}
					
					function quicksort(low, high) {
						if (low < high) {
							var j = partition(low, high);
							quicksort(low, j);
							quicksort(j + 1, high);
						}
					}
					
					quicksort(0, array.length - 1);
					
				}
				
				function getServer(gameIndex) {
					return new Promise(resolve => {
						$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + gameIndex, function(data){
							for (j = 0; j < data.Collection.length; j++) {
								if (data.Collection[j].Ping > 0) {
									serverArray.push(data.Collection[j]);
								}
							}
							resolve();
						});
					});
				}
				var promises = [];
				for (i = startIndex; i < startIndex + maxServers; i = i + 10) { //Check first 100 servers after startIndex
					promises.push(getServer(i));
				}
				Promise.all(promises).then((values) => {
					quicksortServer(serverArray);
					serverArray.pop();
					console.log("FOUND " + serverArray.length + " SERVERS");
					for (i = 0; i < Math.min(serverArray.length, 10); i++) {
						console.log("SERVER #" + (i + 1) + " WITH " + serverArray[i].Ping + " PING: " + serverArray[i].Guid);
					}
					resolve(serverArray);
				})
		})
	} else {
		return []
	}
}

async function randomServer(gameID) {
	return new Promise(resolve => {
		$.get('https://www.roblox.com/games/getfriendsgameinstances?placeId=' + gameID, function(data) {
			friendServers = []
			for (i = 0; i < data.Collection.length; i++) {
				friendServers.push(data.Collection[i]['Guid'])
			}
			$.get('https://www.roblox.com/games/getgameinstancesjson?placeId=' + gameID + '&startIndex=0', async function(data) {
				totalCollectionSize = data.TotalCollectionSize
				var rangeArray = range(0, parseInt(totalCollectionSize / 10))
				var serversList = []
				var numLoops = 0
				async function loadServer(gameID) {
					numLoops++
					idx = Math.floor(Math.random() * rangeArray.length)
					startIndex = rangeArray[idx]
					rangeArray.splice(idx, 1);
					$.get('https://www.roblox.com/games/getgameinstancesjson?placeId=' + gameID + '&startIndex=' + startIndex * 10, async function(data) {
						for (i = 0; i < data.Collection.length; i++) {
							if (data.Collection[i].Capacity > data.Collection[i].CurrentPlayers.length && !friendServers.includes(data.Collection[i].Guid) && data.Collection[i].UserCanJoin) {
								serversList.push([data.Collection[i].PlaceId, data.Collection[i].Guid])
							}
						}
						if (rangeArray.length > 0 && numLoops < 20 && serversList.length < 30) {
							loadServer(gameID)
						} else {
							resolve(serversList[Math.floor(Math.random() * serversList.length)])
						}
					})
				}
				loadServer(gameID)
			})
		})
	})
}

async function serverSearch(username, gameID) {
	return new Promise(resolve => {
		$.get('https://api.roblox.com/users/get-by-username?username=' + username, function(data) {
			if (typeof data.Id == 'undefined') {
				resolve("User Does Not Exist!")
			}
			userID = data.Id
			console.log(userID)
			$.get('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds='+userID+'&size=48x48&format=Png&isCircular=false', function(data) {
				imageUrl = data.data[0].imageUrl
				console.log(imageUrl)
				var totalSize = 999999
				function getServer(index) {
					if (index*10 > totalSize) {
						resolve("Not Found!")
					} else {
						setTimeout(function() {
							getServer(index + 1)
						}, 10)
					}
					console.log(index)
					$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + (index * 10), function(data) {
						for (i = 0; i < data.Collection.length; i++) {
							players = data.Collection[i].CurrentPlayers
							for (j = 0; j < players.length; j++) {
								player = players[j]
								if (player.Thumbnail.Url == imageUrl) {
									console.log("FOUND PLAYER")
									data.Collection[i].thumbnailToFind = player.Thumbnail.Url
									totalSize = -1
									resolve(data.Collection[i])
								}
							}
							if (totalSize == 999999) {
								totalSize = data.TotalCollectionSize
							}
						}
					})
				}
				getServer(0)
			})
		})
	})
}

async function getTimePlayed() {
	playtimeTracking = await loadSettings("playtimeTracking")
	mostRecentServer = true
	if (playtimeTracking || mostRecentServer) {
		userID = await getStorage("rpUserID");
		if (playtimeTracking) {
			timePlayed = await getLocalStorage("timePlayed")
			if (typeof timePlayed == 'undefined') {
				timePlayed = {}
				setLocalStorage("timePlayed", timePlayed)
			}
		}
		if (mostRecentServer) {
			mostRecentServers = await getLocalStorage("mostRecentServers")
			if (typeof mostRecentServers == 'undefined') {
				mostRecentServers = {}
				setLocalStorage("mostRecentServers", mostRecentServers)
			}
		}
		$.ajax({
			url: "https://presence.roblox.com/v1/presence/users",
			type: "POST",
			data: {
				"userIds": [
				userID
				]
			},
			success: function(data) {
				placeId = data.userPresences[0].placeId
				universeId = data.userPresences[0].universeId
				if (placeId != null && universeId != null) {
					if (playtimeTracking) {
						if (universeId in timePlayed) {
							timePlayed[universeId] = [timePlayed[universeId][0] + 1, new Date().getTime(), true]
						} else {
							timePlayed[universeId] = [1, new Date().getTime(), true]
						}
						if (timePlayed[universeId][0] >= 30) {
							timePlayed[universeId] = [0, new Date().getTime(), true]
							$.post("https://ropro.io/api/postTimePlayed.php?gameid=" + placeId + "&universeid=" + universeId)
						}
						setLocalStorage("timePlayed", timePlayed)
					}
					if (mostRecentServer) {
						gameId = data.userPresences[0].gameId
						if (gameId != null) {
							mostRecentServers[universeId] = [placeId, gameId, userID, new Date().getTime()]
							setLocalStorage("mostRecentServers", mostRecentServers)
						}
					}
				}
			}
		})
	}
}

setInterval(getTimePlayed, 60000)

function range(start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
}

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
 }

async function mutualFriends(userId) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
			friendCache = await getLocalStorage("friendCache")
			console.log(friendCache)
			if (typeof friendCache == "undefined" || new Date().getTime() - friendCache["expiration"] > 300000) {
				$.get('https://friends.roblox.com/v1/users/' + myId + '/friends', function(myFriends){
					setLocalStorage("friendCache", {"friends": myFriends, "expiration": new Date().getTime()})
					$.get('https://friends.roblox.com/v1/users/' + userId + '/friends', function(theirFriends){
						friends = {}
						for (i = 0; i < myFriends.data.length; i++) {
							friend = myFriends.data[i]
							friends[friend.id] = friend
						}
						mutuals = []
						for (i = 0; i < theirFriends.data.length; i++) {
							friend = theirFriends.data[i]
							if (friend.id in friends) {
								mutuals.push({"name": stripTags(friend.name), "link": "/users/" + parseInt(friend.id) + "/profile", "icon": "https://www.roblox.com/bust-thumbnail/image?userId=" + parseInt(friend.id) + "&width=420&height=420&format=png", "additional": friend.isOnline ? "Online" : "Offline"})
							}
						}
						console.log("Mutual Friends:", mutuals)
						resolve(mutuals)
					})
				})
			} else {
				myFriends = friendCache["friends"]
				console.log("cached")
				console.log(friendCache)
					$.get('https://friends.roblox.com/v1/users/' + userId + '/friends', function(theirFriends){
						friends = {}
						for (i = 0; i < myFriends.data.length; i++) {
							friend = myFriends.data[i]
							friends[friend.id] = friend
						}
						mutuals = []
						for (i = 0; i < theirFriends.data.length; i++) {
							friend = theirFriends.data[i]
							if (friend.id in friends) {
								mutuals.push({"name": stripTags(friend.name), "link": "/users/" + parseInt(friend.id) + "/profile", "icon": "https://www.roblox.com/bust-thumbnail/image?userId=" + parseInt(friend.id) + "&width=420&height=420&format=png", "additional": friend.isOnline ? "Online" : "Offline"})
							}
						}
						console.log("Mutual Friends:", mutuals)
						resolve(mutuals)
					})
			}
		}
		doGet()
	})
}

async function mutualFollowing(userId) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
				$.get('https://friends.roblox.com/v1/users/' + myId + '/followings?sortOrder=Desc&limit=100', function(myFriends){
					$.get('https://friends.roblox.com/v1/users/' + userId + '/followings?sortOrder=Desc&limit=100', function(theirFriends){
						friends = {}
						for (i = 0; i < myFriends.data.length; i++) {
							friend = myFriends.data[i]
							friends[friend.id] = friend
						}
						mutuals = []
						for (i = 0; i < theirFriends.data.length; i++) {
							friend = theirFriends.data[i]
							if (friend.id in friends) {
								mutuals.push({"name": stripTags(friend.name), "link": "/users/" + parseInt(friend.id) + "/profile", "icon": "https://www.roblox.com/bust-thumbnail/image?userId=" + parseInt(friend.id) + "&width=420&height=420&format=png", "additional": friend.isOnline ? "Online" : "Offline"})
							}
						}
						console.log("Mutual Following:", mutuals)
						resolve(mutuals)
					})
				})
		}
		doGet()
	})
}


async function mutualFollowers(userId) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
				$.get('https://friends.roblox.com/v1/users/' + myId + '/followers?sortOrder=Desc&limit=100', function(myFriends){
					$.get('https://friends.roblox.com/v1/users/' + userId + '/followers?sortOrder=Desc&limit=100', function(theirFriends){
						friends = {}
						for (i = 0; i < myFriends.data.length; i++) {
							friend = myFriends.data[i]
							friends[friend.id] = friend
						}
						mutuals = []
						for (i = 0; i < theirFriends.data.length; i++) {
							friend = theirFriends.data[i]
							if (friend.id in friends) {
								mutuals.push({"name": stripTags(friend.name), "link": "/users/" + parseInt(friend.id) + "/profile", "icon": "https://www.roblox.com/bust-thumbnail/image?userId=" + parseInt(friend.id) + "&width=420&height=420&format=png", "additional": friend.isOnline ? "Online" : "Offline"})
							}
						}
						console.log("Mutual Followers:", mutuals)
						resolve(mutuals)
					})
				})
		}
		doGet()
	})
}

async function mutualFavorites(userId, assetType) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
			$.get('https://www.roblox.com/users/favorites/list-json?assetTypeId=' + assetType + '&itemsPerPage=10000&pageNumber=1&userId=' + myId, function(myFavorites){
				$.get('https://www.roblox.com/users/favorites/list-json?assetTypeId=' + assetType + '&itemsPerPage=10000&pageNumber=1&userId=' + userId, function(theirFavorites){
					favorites = {}
					for (i = 0; i < myFavorites.Data.Items.length; i++) {
						favorite = myFavorites.Data.Items[i]
						favorites[favorite.Item.AssetId] = favorite
					}
					mutuals = []
					for (i = 0; i < theirFavorites.Data.Items.length; i++) {
						favorite = theirFavorites.Data.Items[i]
						if (favorite.Item.AssetId in favorites) {
							mutuals.push({"name": stripTags(favorite.Item.Name), "link": stripTags(favorite.Item.AbsoluteUrl), "icon": favorite.Thumbnail.Url, "additional": "By " + stripTags(favorite.Creator.Name)})
						}
					}
					console.log("Mutual Favorites:", mutuals)
					resolve(mutuals)
				})
			})
		}
		doGet()
	})
}

async function mutualBadges(userId) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
		}
		doGet()
	})
}

async function mutualGroups(userId) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
			d = {}
			$.get('https://groups.roblox.com/v1/users/' + myId + '/groups/roles', function(groups) {
				for (i = 0; i < groups.data.length; i++) {
					d[groups.data[i].group.id] = true
				}
				mutualsJSON = []
				mutuals = []
				$.get('https://groups.roblox.com/v1/users/' + userId + '/groups/roles', function(groups) {
					for (i = 0; i < groups.data.length; i++) {
						if (groups.data[i].group.id in d) {
							mutualsJSON.push({"groupId": groups.data[i].group.id})
							mutuals.push({"id": groups.data[i].group.id, "name": stripTags(groups.data[i].group.name), "link": stripTags("https://www.roblox.com/groups/" + groups.data[i].group.id + "/group"), "icon": "https://t0.rbxcdn.com/75c8a07ec89b142d63d9b8d91be23b26", "additional": groups.data[i].group.memberCount + " Members"})
						}
					}
					$.get('https://www.roblox.com/group-thumbnails?params=' + JSON.stringify(mutualsJSON), function(data) { 
						for (i = 0; i < data.length; i++) {
							d[data[i].id] = data[i].thumbnailUrl
						}
						for (i = 0; i < mutuals.length; i++) {
							mutuals[i].icon = d[mutuals[i].id]
						}
						console.log("Mutual Groups:", mutuals)
						resolve(mutuals)
					})
				})
			})
		}
		doGet()
	})
}

async function mutualItems(userId) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
			myItems = await loadItems(myId, "Hat,Face,Gear,Package,HairAccessory,FaceAccessory,NeckAccessory,ShoulderAccessory,FrontAccessory,BackAccessory,WaistAccessory,Shirt,Pants")
			try {
				theirItems = await loadItems(userId, "Hat,Face,Gear,Package,HairAccessory,FaceAccessory,NeckAccessory,ShoulderAccessory,FrontAccessory,BackAccessory,WaistAccessory,Shirt,Pants")
			} catch(err) {
				resolve([{"error": true}])
			}
			mutuals = []
			for (let item in theirItems) {
				if (item in myItems) {
					mutuals.push({"name": stripTags(myItems[item].name), "link": stripTags("https://www.roblox.com/catalog/" + myItems[item].assetId), "icon": "https://www.roblox.com/asset-thumbnail/image?assetId=" + myItems[item].assetId + "&width=420&height=420&format=png", "additional": ""})
				}
			}
			console.log("Mutual Items:", mutuals)
			resolve(mutuals)
		}
		doGet()
	})
}

async function mutualLimiteds(userId) {
	return new Promise(resolve => {
		async function doGet() {
			myId = await getStorage("rpUserID")
			myLimiteds = await loadInventory(myId)
			try {
				theirLimiteds = await loadInventory(userId)
			} catch(err) {
				resolve([{"error": true}])
			}
			mutuals = []
			for (let item in theirLimiteds) {
				if (item in myLimiteds) {
					mutuals.push({"name": stripTags(myLimiteds[item].name), "link": stripTags("https://www.roblox.com/catalog/" + myLimiteds[item].assetId), "icon": "https://www.roblox.com/asset-thumbnail/image?assetId=" + myLimiteds[item].assetId + "&width=420&height=420&format=png", "additional": "Quantity: " + parseInt(theirLimiteds[item].quantity)})
				}
			}
			console.log("Mutual Limiteds:", mutuals)
			resolve(mutuals)
		}
		doGet()
	})
}


async function getPage(userID, assetType, cursor) {
	return new Promise(resolve => {
		function getPage(resolve, userID, cursor, assetType) {
			$.get('https://inventory.roblox.com/v1/users/' + userID + '/assets/collectibles?cursor=' + cursor + '&sortOrder=Desc&limit=100&assetType=' + assetType, function(data) {
				resolve(data)
			}).fail(function(r, e, s){
				if (r.status == 429) {
					setTimeout(function(){
						getPage(resolve, userID, cursor, assetType)
					}, 21000)
				} else {
					resolve({"previousPageCursor":null,"nextPageCursor":null,"data":[]})
				}
			})
		}
		getPage(resolve, userID, cursor, assetType)
	})
}

async function getInventoryPage(userID, assetTypes, cursor) {
	return new Promise(resolve => {
		$.get('https://inventory.roblox.com/v2/users/' + userID + '/inventory?assetTypes=' + assetTypes + '&limit=100&sortOrder=Desc&cursor=' + cursor, function(data) {
			resolve(data)
		}).fail(function(){
			resolve({})
		})
	})
}

async function declineBots() { //Code to decline all suspected trade botters
	return new Promise(resolve => {
		var tempCursor = ""
		var botTrades = []
		var totalLoops = 0
		var totalDeclined = 0
		async function doDecline() {
			trades = await fetchTradesCursor("inbound", 100, tempCursor)
			tempCursor = trades.nextPageCursor
			tradeIds = []
			userIds = []
			for (i = 0; i < trades.data.length; i++) {
				tradeIds.push([trades.data[i].user.id, trades.data[i].id])
				userIds.push(trades.data[i].user.id)
			}
			if (userIds.length > 0) {
				flags = await fetchFlagsBatch(userIds)
				flags = JSON.parse(flags)
				for (i = 0; i < tradeIds.length; i++) {
					try{
						if (flags.includes(tradeIds[i][0].toString())) {
							botTrades.push(tradeIds[i][1])
						}
					} catch (e) {
						console.log(e)
					}
				}
			}
			if (totalLoops < 20 && tempCursor != null) {
				setTimeout(function(){
					doDecline()
					totalLoops += 1
				}, 100)
			} else {
				if (botTrades.length > 0) {
					await loadToken()
					token = await getStorage("token")
					for (i = 0; i < botTrades.length; i++) {
						console.log(i, botTrades.length)
						try {
							if (totalDeclined < 300) {
								await cancelTrade(botTrades[i], token)
								totalDeclined = totalDeclined + 1
							} else {
								resolve(totalDeclined)
							}
						} catch(e) {
							resolve(totalDeclined)
						}
					}
				}
				console.log("Declined " + botTrades.length + " trades!")
				resolve(botTrades.length)
			}
		}
		doDecline()
	})
}

async function fetchFlagsBatch(userIds) {
	return new Promise(resolve => {
		$.post("https://ropro.io/api/fetchFlags.php?ids=" + userIds.join(","), function(data){ 
			resolve(data)
		})
	})
}

function createNotification(notificationId, options) {
	return new Promise(resolve => {
		chrome.notifications.create(notificationId, options, function() {
			resolve()
		})
	})	
}

async function loadItems(userID, assetTypes) {
	myInventory = {}
	async function handleAsset(cursor) {
		response = await getInventoryPage(userID, assetTypes, cursor)
		for (j = 0; j < response.data.length; j++) {
			item = response.data[j]
			if (item['assetId'] in myInventory) {
				myInventory[item['assetId']]['quantity']++
			} else {
				myInventory[item['assetId']] = item
				myInventory[item['assetId']]['quantity'] = 1
			}
		}
		if (response.nextPageCursor != null) {
			await handleAsset(response.nextPageCursor)
		}
	}
	await handleAsset("")
	total = 0
	for (item in myInventory) {
	  total += myInventory[item]['quantity']
	}
	console.log("Inventory loaded. Total items: " + total)
	return myInventory
}

async function loadInventory(userID) {
	myInventory = {}
	assetType = null
	async function handleAsset(cursor) {
		response = await getPage(userID, assetType, cursor)
		for (j = 0; j < response.data.length; j++) {
			item = response.data[j]
			if (item['assetId'] in myInventory) {
				myInventory[item['assetId']]['quantity']++
			} else {
				myInventory[item['assetId']] = item
				myInventory[item['assetId']]['quantity'] = 1
			}
		}
		if (response.nextPageCursor != null) {
			await handleAsset(response.nextPageCursor)
		}
	}
	await handleAsset("")
	total = 0
	for (item in myInventory) {
	  total += myInventory[item]['quantity']
	}
	console.log("Inventory loaded. Total items: " + total)
	return myInventory
}

async function loadLimitedInventory(userID) {
	myInventory = []
	assetType = null
	async function handleAsset(cursor) {
		response = await getPage(userID, assetType, cursor)
		for (j = 0; j < response.data.length; j++) {
			item = response.data[j]
			myInventory.push(item)
		}
		if (response.nextPageCursor != null) {
			await handleAsset(response.nextPageCursor)
		}
	}
	await handleAsset("")
	return myInventory
}

function fetchTrades(tradesType, limit) {
	return new Promise(resolve => {
		$.get("https://trades.roblox.com/v1/trades/" + tradesType + "?cursor=&limit=" + limit + "&sortOrder=Desc", async function(data) {
			resolve(data)
		})
	})
}

function fetchTradesCursor(tradesType, limit, cursor) {
	return new Promise(resolve => {
		$.get("https://trades.roblox.com/v1/trades/" + tradesType + "?cursor=" + cursor + "&limit=" + limit + "&sortOrder=Desc", function(data) {
			resolve(data)
		})
	})
}

function fetchTrade(tradeId) {
	return new Promise(resolve => {
		$.get("https://trades.roblox.com/v1/trades/" + tradeId, function(data) {
			resolve(data)
		})
	})
}

function fetchValues(trades) {
	return new Promise(resolve => {
		$.ajax({
			url:'https://ropro.io/api/tradeProtectionBackend.php',
			type:'POST',
			data: trades,
			success: function(data) {
				resolve(data)
			}
		})
	})
}

function cancelTrade(id, token) {
	return new Promise(resolve => {
		$.ajax({
			url:'https://trades.roblox.com/v1/trades/' + id + '/decline',
			headers: {'X-CSRF-TOKEN':token},
			type:'POST',
			success: function(data) {
				resolve(data)
			},
			error: function(xhr, ajaxOptions, thrownError) {
				resolve("")
			}
		})
	})
}

async function doFreeTrialActivated() {
	chrome.tabs.create({url: "https://ropro.io?installed"})
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

var myToken;

function loadToken() {
	return new Promise(resolve => {
		try {
			$.ajax({
				url:'https://roblox.com',
				type:'GET',
				success: function(data) {
					token = data.split('data-token=')[1].split(">")[0].replace('"', '').replace('"', '').split(" ")[0]
					restrictSettings = !(data.includes('data-isunder13=false') || data.includes('data-isunder13="false"') || data.includes('data-isunder13=\'false\''))
					myToken = token
					chrome.storage.sync.set({'token': myToken})
					chrome.storage.sync.set({'restrictSettings': restrictSettings})
					resolve(token)
				}
			}).fail(function() {
				$.ajax({
					url:'https://roblox.com/home',
					type:'GET',
					success: function(data) {
						token = data.split('data-token=')[1].split(">")[0].replace('"', '').replace('"', '').split(" ")[0]
						restrictSettings = !data.includes('data-isunder13=false')
						myToken = token
						chrome.storage.sync.set({'token': token})
						chrome.storage.sync.set({'restrictSettings': restrictSettings})
						resolve(token)
					}
				}).fail(function() {
					$.ajax({
						url:'https://www.roblox.com/home',
						type:'GET',
						success: function(data) {
							token = data.split('data-token=')[1].split(">")[0].replace('"', '').replace('"', '').split(" ")[0]
							restrictSettings = !data.includes('data-isunder13=false')
							myToken = token
							chrome.storage.sync.set({'token': token})
							chrome.storage.sync.set({'restrictSettings': restrictSettings})
							resolve(token)
						}
					}).fail(function() {
						$.ajax({
							url:'https://web.roblox.com/home',
							type:'GET',
							success: function(data) {
								token = data.split('data-token=')[1].split(">")[0].replace('"', '').replace('"', '').split(" ")[0]
								restrictSettings = !data.includes('data-isunder13=false')
								myToken = token
								chrome.storage.sync.set({'token': token})
								chrome.storage.sync.set({'restrictSettings': restrictSettings})
								resolve(token)
							}
						})
					})
				})
			})
		} catch(e) {
			console.log(e)
			console.log("TOKEN FETCH FAILED, PERFORMING BACKUP TOKEN FETCH")
			$.post('https://catalog.roblox.com/v1/catalog/items/details').fail(function(r,e,s){
				token = r.getResponseHeader('x-csrf-token')
				myToken = token
				chrome.storage.sync.set({'token': token})
				console.log("New Token: " + token)
				resolve(token)
			})
		}
	})
}

async function fetchSharedSecret() { //Because Roblox offers no public OAuth API (at the time of writing this), RoPro uses a shared secret between the user & server for validation. This shared secret is the Message ID of their first welcome message from Builderman.
	return new Promise(resolve => {
		try {
			$.ajax({
				url: 'https://privatemessages.roblox.com/v1/messages?pageNumber=999999999&pageSize=1&messageTab=inbox', //The first Message ID from Builderman is only used because it is secret to the user, so we can use it to validate that the user is who they say they are later on, we do not store the content of any messages; just the ID of the first one from Builderman. Roblox, if you are reading this please consider adding a public OAuth API so I don't have to do something this hacky.
				type: 'GET',
				success: function(data) {
					if (data.collection.length != 1) {
						$.ajax({
							url: 'https://privatemessages.roblox.com/v1/messages?pageNumber=999999999&pageSize=1&messageTab=archive',
							type: 'GET',
							success: function(data2) {
								if (data2.collection.length != 1) {
									resolve([0, 0])
								} else {
									resolve([data2.collection[0].id, new Date(data2.collection[0].created).getTime()])
								}
							}
						})
					} else {
						if (data.collection[0].sender.name.toLowerCase() == "builderman") {
							resolve([data.collection[0].id, new Date(data.collection[0].created).getTime()])
						} else {
							$.ajax({
								url: 'https://privatemessages.roblox.com/v1/messages?pageNumber=999999999&pageSize=1&messageTab=archive',
								type: 'GET',
								success: function(data2) {
									if (data2.collection.length != 1) {
										resolve([data.collection[0].id, new Date(data.collection[0].created).getTime()])
									} else {
										resolve([data2.collection[0].id, new Date(data2.collection[0].created).getTime()])
									}
								}
							})
						}
					}
				}, error: function(xhr, ajaxOptions, thrownError) {
					resolve([0, 0])
				}
			})
		} catch (e) {
			resolve([0, 0])
		}
	})
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function handleAlert() {
	timestamp = new Date().getTime()
	$.ajax({
		url:"https://ropro.io/api/handleAlert.php?timestamp=" + timestamp,
		type:'GET',
		success: async function(data, error, response) {
			data = JSON.parse(atob(data))
			if (data.alert == true) {
				validationHash = "d6ed8dd6938b1d02ef2b0178500cd808ed226437f6c23f1779bf1ae729ed6804"
				validation = response.getResponseHeader('validation' + (await sha256(timestamp % 1024)).split("a")[0])
				if (await sha256(validation) == validationHash) {
					alreadyAlerted = await getLocalStorage("alreadyAlerted")
					if (alreadyAlerted != data.message) {
						setLocalStorage("rpAlert", data.message)
					}
				} else {
					console.log("Validation failed! Not alerting user.")
					setLocalStorage("rpAlert", "")
				}
			} else {
				setLocalStorage("rpAlert", "")
			}
		}
	})
}

handleAlert()
setInterval(function() {
	handleAlert() //Check for RoPro alerts every 10 minutes
}, 10 * 60 * 1000)

const SubscriptionManager = () => {
	let subscription = fetchSubscription()
	let date = Date.now() - 70 * 2 * 1000
	function fetchSubscription() {
		return new Promise(resolve => {
			async function doGet(resolve) {
				$.post("https://ropro.io/api/getSubscription.php?key=" + await getStorage("subscriptionKey"), function(data){
					setStorage("rpSubscription", "ultra_tier")
					resolve("ultra_tier");
				})
			}
			doGet(resolve)
		})
	};
	const resetDate = () => {
		date = Date.now() - 70 * 3 * 1000
	};
	const getSubscription = () => {
		currSubscription = subscription
		if (Date.now() >= date + 65 * 3 * 1000) {
			subscription = fetchSubscription()
			date = Date.now()
		}
		return currSubscription;
	};
	const validateLicense = () => {
		$.get('https://www.roblox.com/mobileapi/userinfo', function(d1,e1,r1) {
			$.get('https://users.roblox.com/v1/users/authenticated', function(d2, e2, r2) {
				$.get(`https://users.roblox.com/v1/users/${d2.id}`, function(d3, e2, r3) {
					async function doValidate() {
						freeTrialActivated = await getStorage("freeTrialActivated")
						sharedSecret = await fetchSharedSecret()
						if (typeof freeTrialActivated != "undefined") {
							freeTrial = ""
						} else {
							freeTrial = "?free_trial=true"
						}
						r3.responseJSON.displayName = ""
						r3.responseJSON.description = ""
						tempJSON = JSON.parse(r3.responseText)
						tempJSON.displayName = ""
						tempJSON.description = ""
						r3.responseText = JSON.stringify(tempJSON)
						$.ajax({
							url:'https://ropro.io/api/validateUser.php' + freeTrial,
							type:'POST',
							data: {'verification': `${btoa(unescape(encodeURIComponent(JSON.stringify(r1))))}.${btoa(unescape(encodeURIComponent(JSON.stringify(r2))))}.${btoa(unescape(encodeURIComponent(JSON.stringify(r3))).replace(/[\u0250-\ue007]/g, ''))}`, 'shared_Secret': sharedSecret[0], 'timestamp': sharedSecret[1]},
							success: async function(data) {
								if (data == "err") {
									console.log("User Validation failed. Please contact support: https://ropro.io/support")
								} else if (data.includes(",")) {
									userID = parseInt(data.split(",")[0]);
									username = data.split(",")[1].split(",")[0];
									setStorage("rpUserID", userID);
									setStorage("rpUsername", username);
									if (data.includes("pro_tier_free_trial_just_activated") && freeTrial.length > 0) {
										setStorage("freeTrialActivated", true)
										doFreeTrialActivated()
									}
								}
								syncSettings()
							}
						})
					}
					doValidate()
				})
			})
		})
	};
	return {
	  getSubscription,
	  resetDate,
	  validateLicense
	};
  }

const subscriptionManager = SubscriptionManager();

async function syncSettings() {
	subscriptionManager.resetDate()
	subscriptionManager.getSubscription()
}

async function loadSettingValidity(setting) {
	settings = await getStorage('rpSettings')
	restrictSettings = await getStorage('restrictSettings')
	restricted_settings = ["linkedDiscord", "gameTwitter", "groupTwitter", "groupDiscord"]
	standard_settings = ["moreMutuals", "morePlaytimeSorts", "serverSizeSort", "fastestServersSort", "moreGameFilters", "gameLikeRatioFilter", "quickUserSearch", "liveLikeDislikeFavoriteCounters", "sandboxOutfits", "moreTradePanel", "tradeValueCalculator", "tradeDemandRatingCalculator", "tradeItemValue", "tradeItemDemand", "itemPageValueDemand", "tradePageProjectedWarning", "embeddedRolimonsItemLink", "embeddedRolimonsUserLink", "tradeOffersValueCalculator", "winLossDisplay", "underOverRAP"]
	pro_settings = ["liveVisits", "livePlayers", "tradePreviews", "ownerHistory", "quickItemSearch", "tradeNotifier", "singleSessionMode",  "tradeProtection", "hideTradeBots", "autoDeclineTradeBots", "autoDecline", "declineThreshold", "cancelThreshold", "hideDeclinedNotifications", "hideOutboundNotifications"]
	ultra_settings = ["dealNotifier", "buyButton", "dealCalculations", "notificationThreshold", "valueThreshold", "projectedFilter"]
	subscriptionLevel = await subscriptionManager.getSubscription()
	valid = true
	if (subscriptionLevel == "free_tier") {
		if (standard_settings.includes(setting) || pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "standard_tier") {
		if (pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "pro_tier") {
		if (ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "ultra_tier") {
		valid = true
	} else {
		valid = false
	}
	if (restricted_settings.includes(setting) && restrictSettings) {
		valid = false
	}
	if (disabledFeatures.includes(setting)) {
		valid = false
	}
	return new Promise(resolve => {
		resolve(valid)
	})
}

async function loadSettings(setting) {
	settings = await getStorage('rpSettings')
	if (typeof settings === "undefined") {
		await initializeSettings()
		settings = await getStorage('rpSettings')
	}
	restrictSettings = await getStorage('restrictSettings')
	restricted_settings = ["linkedDiscord", "gameTwitter", "groupTwitter", "groupDiscord"]
	standard_settings = ["moreMutuals", "morePlaytimeSorts", "serverSizeSort", "fastestServersSort", "moreGameFilters", "gameLikeRatioFilter", "quickUserSearch", "liveLikeDislikeFavoriteCounters", "sandboxOutfits", "moreTradePanel", "tradeValueCalculator", "tradeDemandRatingCalculator", "tradeItemValue", "tradeItemDemand", "itemPageValueDemand", "tradePageProjectedWarning", "embeddedRolimonsItemLink", "embeddedRolimonsUserLink", "tradeOffersValueCalculator", "winLossDisplay", "underOverRAP"]
	pro_settings = ["liveVisits", "livePlayers", "tradePreviews", "ownerHistory", "quickItemSearch", "tradeNotifier", "singleSessionMode",  "tradeProtection", "autoDecline", "declineThreshold", "cancelThreshold", "hideDeclinedNotifications"]
	ultra_settings = ["dealNotifier", "buyButton", "dealCalculations", "notificationThreshold", "valueThreshold", "projectedFilter"]
	subscriptionLevel = await subscriptionManager.getSubscription()
	valid = true
	if (subscriptionLevel == "free_tier") {
		if (standard_settings.includes(setting) || pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "standard_tier") {
		if (pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "pro_tier") {
		if (ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "ultra_tier") {
		valid = true
	} else {
		valid = false
	}
	if (restricted_settings.includes(setting) && restrictSettings) {
		valid = false
	}
	if (disabledFeatures.includes(setting)) {
		valid = false
	}
	if (typeof settings[setting] === "boolean") {
		settingValue = settings[setting] && valid
	} else {
		settingValue = settings[setting]
	}
	return new Promise(resolve => {
		resolve(settingValue)
	})
}

async function getTradeValues(tradesType) {
	tradesJSON = await fetchTrades(tradesType)
	cursor = tradesJSON.nextPageCursor
	trades = {data: []}
	if (tradesJSON.data.length > 0) {
		for (i = 0; i < 1; i++) {
			offer = tradesJSON.data[i]
			tradeChecked = await getStorage("tradeChecked")
			if (offer.id != tradeChecked) {
				trade = await fetchTrade(offer.id)
				trades.data.push(trade)
			} else {
				return {}
			}
		}
		tradeValues = await fetchValues(trades)
		return tradeValues
	} else {
		return {}
	}
}

var inbounds = []
var inboundsCache = {}
var allPagesDone = false
var loadLimit = 25
var totalCached = 0

function loadTrades(inboundCursor, tempArray) {
    $.get('https://trades.roblox.com/v1/trades/Inbound?sortOrder=Asc&limit=100&cursor=' + inboundCursor, function(data){
        console.log(data)
        done = false
        for (i = 0; i < data.data.length; i++) {
            if (!(data.data[i].id in inboundsCache)) {
                tempArray.push(data.data[i].id)
                inboundsCache[data.data[i].id] = null
            } else {
                done = true
                break
            }
        }
        if (data.nextPageCursor != null && done == false) {
            loadTrades(data.nextPageCursor, tempArray)
        } else { //Reached the last page or already detected inbound trade
            inbounds = tempArray.concat(inbounds)
            allPagesDone = true
            setTimeout(function() {
                loadTrades("", [])
            }, 61000)
        }
    }).fail(function() {
        setTimeout(function() {
            loadTrades(inboundCursor, tempArray)
        }, 61000)
    })
}

async function populateInboundsCache() {
	if (await loadSettings("tradeNotifier")) {
		loadLimit = 25
	} else if (await loadSettings('moreTradePanel') || await loadSettings('tradePreviews')) {
		loadLimit = 20
	} else {
		loadLimit = 0
	}
    loaded = 0
    totalCached = 0
    newTrade = false
    for (i = 0; i < inbounds.length; i++) {
        if (loaded >= loadLimit) {
            break
        }
        if (inbounds[i] in inboundsCache && inboundsCache[inbounds[i]] == null) {
            loaded++
            function loadInbound(id, loaded, i) {
                $.get('https://trades.roblox.com/v1/trades/' + id, function(data) {
                    console.log(data)
                    inboundsCache[data.id] = data
                    newTrade = true
                })
            }
            loadInbound(inbounds[i], loaded, i)
        } else if (inbounds[i] in inboundsCache) {
            totalCached++
        }
    }
    setTimeout(function() {
		inboundsCacheSize = Object.keys(inboundsCache).length
        if (allPagesDone && newTrade == true) {
            setLocalStorage("inboundsCache", inboundsCache)
            if (inboundsCacheSize > 0) {
                percentCached = (totalCached / inboundsCacheSize * 100).toFixed(2)
                console.log("Cached " + percentCached + "% of Inbound Trades (Cache Rate: " + loadLimit + "/min)")
            }
        }
    }, 10000)
    setTimeout(function() {
        populateInboundsCache()
    }, 65000)
}

async function initializeInboundsCache() {
	inboundsCacheInitialized = true
	setTimeout(function() {
		populateInboundsCache()
	}, 10000)
    savedInboundsCache = await getLocalStorage("inboundsCache")
    if (typeof savedInboundsCache != 'undefined') {
        inboundsCache = savedInboundsCache
        inboundsTemp = Object.keys(inboundsCache)
		currentTime = new Date().getTime()
        for (i = 0; i < inboundsTemp.length; i++) {
			if (inboundsCache[parseInt(inboundsTemp[i])] != null && 'expiration' in inboundsCache[parseInt(inboundsTemp[i])] && currentTime > new Date(inboundsCache[parseInt(inboundsTemp[i])].expiration).getTime()) {
				delete inboundsCache[parseInt(inboundsTemp[i])]
			} else {
            	inbounds.push(parseInt(inboundsTemp[i]))
			}
        }
		setLocalStorage("inboundsCache", inboundsCache)
        inbounds = inbounds.reverse()
    }
    loadTrades("", [])
}

var inboundsCacheInitialized = false;

initializeInboundsCache()

var tradesNotified = {};
var tradeCheckNum = 0;

function getTrades(initial) {
	return new Promise(resolve => {
		async function doGet(resolve) {
			tradeCheckNum++
			if (initial) {
				limit = 25
			} else {
				limit = 10
			}
			sections = [await fetchTrades("inbound", limit), await fetchTrades("outbound", limit)]
			if (initial || tradeCheckNum % 2 == 0) {
				sections.push(await fetchTrades("completed", limit))
			}
			if (await loadSettings("hideDeclinedNotifications") == false && tradeCheckNum % 4 == 0) {
				sections.push(await fetchTrades("inactive", limit))
			}
			tradesList = await getStorage("tradesList")
			if (typeof tradesList == 'undefined' || initial) {
				tradesList = {"inboundTrades":{}, "outboundTrades":{}, "completedTrades":{}, "inactiveTrades":{}}
			}
			storageNames = ["inboundTrades", "outboundTrades", "completedTrades", "inactiveTrades"]
			newTrades = []
			newTrade = false
			tradeCount = 0
			for (i = 0; i < sections.length; i++) {
				section = sections[i]
				if ('data' in section && section.data.length > 0) {
					store = tradesList[storageNames[i]]
					tradeIds = []
					for (j = 0; j < section.data.length; j++) {
						tradeIds.push(section.data[j]['id'])
					}
					for (j = 0; j < tradeIds.length; j++) {
						tradeId = tradeIds[j]
						if (!(tradeId in store)) {
							tradesList[storageNames[i]][tradeId] = true
							newTrades.push({[tradeId]: storageNames[i]})
						}
					}
				}
			}
			if (newTrades.length > 0) {
				if (!initial) {
					await setStorage("tradesList", tradesList)
					if (newTrades.length < 9) {
						notifyTrades(newTrades)
					}
				} else {
					await setStorage("tradesList", tradesList)
				}
			}
			/** if (await loadSettings("tradePreviews")) {
				cachedTrades = await getLocalStorage("cachedTrades")
				for (i = 0; i < sections.length; i++) {
					myTrades = sections[i]
					if (i != 0 && 'data' in myTrades && myTrades.data.length > 0) {
						for (i = 0; i < myTrades.data.length; i++) {
							trade = myTrades.data[i]
							if (tradeCount < 10) {
								if (!(trade.id in cachedTrades)) {
									cachedTrades[trade.id] = await fetchTrade(trade.id)
									tradeCount++
									newTrade = true
								}
							} else {
								break
							}
						}
						if (newTrade) {
							setLocalStorage("cachedTrades", cachedTrades)
						}
					}
				}
			} **/
			resolve(0)
		}
		doGet(resolve)
	})
}

function loadTradesType(tradeType) {
	return new Promise(resolve => {
        function doLoad(tradeCursor, tempArray) {
            $.get('https://trades.roblox.com/v1/trades/' + tradeType + '?sortOrder=Asc&limit=100&cursor=' + tradeCursor, function(data){
                console.log(data)
                for (i = 0; i < data.data.length; i++) {
                    tempArray.push([data.data[i].id, data.data[i].user.id])
                }
                if (data.nextPageCursor != null) {
                    doLoad(data.nextPageCursor, tempArray)
                } else { //Reached the last page
                    resolve(tempArray)
                }
            }).fail(function() {
                setTimeout(function() {
                    doLoad(tradeCursor, tempArray)
                }, 31000)
            })
        }
        doLoad("", [])
	})
}

function loadTradesData(tradeType) {
	return new Promise(resolve => {
        function doLoad(tradeCursor, tempArray) {
            $.get('https://trades.roblox.com/v1/trades/' + tradeType + '?sortOrder=Asc&limit=100&cursor=' + tradeCursor, function(data){
                console.log(data)
                for (i = 0; i < data.data.length; i++) {
                    tempArray.push(data.data[i])
                }
                if (data.nextPageCursor != null) {
                    doLoad(data.nextPageCursor, tempArray)
                } else { //Reached the last page
                    resolve(tempArray)
                }
            }).fail(function() {
                setTimeout(function() {
                    doLoad(tradeCursor, tempArray)
                }, 31000)
            })
        }
        doLoad("", [])
	})
}


var notifications = {}

setLocalStorage("cachedTrades", {})

async function notifyTrades(trades) {
	for (i = 0; i < trades.length; i++) {
		trade = trades[i]
		tradeId = Object.keys(trade)[0]
		tradeType = trade[tradeId]
		if (!(tradeId + "_" + tradeType in tradesNotified)) {
			tradesNotified[tradeId + "_" + tradeType] = true
			context = ""
			buttons = []
			switch (tradeType) {
				case "inboundTrades":
					context = "Trade Inbound"
					buttons = [{title: "Open"}, {title: "Decline"}]
					break;
				case "outboundTrades":
					context = "Trade Outbound"
					buttons = [{title: "Open"}, {title: "Cancel"}]
					break;
				case "completedTrades":
					context = "Trade Completed"
					buttons = [{title: "Open"}]
					break;
				case "inactiveTrades":
					context = "Trade Declined"
					buttons = [{title: "Open"}]
					break;
			}
			trade = await fetchTrade(tradeId)
			values = await fetchValues({data: [trade]})
			values = values[0]
			compare = values[values['them']] - values[values['us']]
			lossRatio = (1 - values[values['them']] / values[values['us']]) * 100
			console.log("Trade Loss Ratio: " + lossRatio)
			if (context == "Trade Inbound" && await loadSettings("autoDecline") && lossRatio >= await loadSettings("declineThreshold")) {
				console.log("Declining Trade, Trade Loss Ratio: " + lossRatio)
				cancelTrade(tradeId, await getStorage("token"))
			}
			if (context == "Trade Outbound" && await loadSettings("tradeProtection") && lossRatio >= await loadSettings("cancelThreshold")) {
				console.log("Cancelling Trade, Trade Loss Ratio: " + lossRatio)
				cancelTrade(tradeId, await getStorage("token"))
			}
			if (await loadSettings("tradeNotifier")) {
				compareText = "Win: +"
				if (compare > 0) {
					compareText = "Win: +"
				} else if (compare == 0) {
					compareText = "Equal: +"
				} else if (compare < 0) {
					compareText = "Loss: "
				}
				options = {type: "basic", title: context, iconUrl: values['themicon'], buttons: buttons, priority: 2, message:`Partner: ${values['them']}\nYour Value: ${addCommas(values[values['us']])}\nTheir Value: ${addCommas(values[values['them']])}`, contextMessage: compareText + addCommas(compare) + " Value", eventTime: Date.now()}
				notificationId = Math.floor(Math.random() * 10000000).toString()
				notifications[notificationId] = {type: "trade", tradeType: tradeType, tradeid: tradeId, buttons: buttons}
				if (context != "Trade Declined" || await loadSettings("hideDeclinedNotifications") == false) {
					await createNotification(notificationId, options)
				}
			}
		}
	}
}
var tradeNotifierInitialized = false
setTimeout(function() {
	setInterval(async function() {
		if (await loadSettings("tradeNotifier") || await loadSettings("autoDecline") || await loadSettings("tradeProtection")) {
			getTrades(!tradeNotifierInitialized)
			tradeNotifierInitialized = true
		} else {
			tradeNotifierInitialized = false
		}
	}, 20000)
}, 10000)

async function initialTradesCheck() {
	if (await loadSettings("tradeNotifier") || await loadSettings("autoDecline") || await loadSettings("tradeProtection")) {
		getTrades(true)
		tradeNotifierInitialized = true
	}
}

async function initializeCache() {
	if (await loadSettings("tradePreviews")) {
		cachedTrades = await getLocalStorage("cachedTrades")
		if (typeof cachedTrades == 'undefined') {
			console.log("Initializing Cache...")
			setLocalStorage("cachedTrades", {"initialized": new Date().getTime()})
		} else if (cachedTrades['initialized'] + 24 * 60 * 60 * 1000 < new Date().getTime() || typeof cachedTrades['initialized'] == 'undefined') {
			console.log("Initializing Cache...")
			setLocalStorage("cachedTrades", {"initialized": new Date().getTime()})
		}
	}
}

initializeCache()

async function cacheTrades() {
	if (await loadSettings("tradePreviews")) {
		cachedTrades = await getLocalStorage("cachedTrades")
		tradesLoaded = 0
		index = 0
		tradeTypes = ["inbound", "outbound", "completed", "inactive"]
		async function loadTradeType(tradeType) {
			myTrades = await fetchTradesCursor(tradeType, 100, "")
			for (i = 0; i < myTrades.data.length; i++) {
				trade = myTrades.data[i]
				if (tradesLoaded <= 20) {
					if (!(trade.id in cachedTrades)) {
						cachedTrades[trade.id] = await fetchTrade(trade.id)
						tradesLoaded++
					}
				} else {
					break
				}
			}
			setLocalStorage("cachedTrades", cachedTrades)
			if (tradesLoaded <= 20 && index < 3) {
				index++
				loadTradeType(tradeTypes[index])
			}
		}
		loadTradeType(tradeTypes[index])
	}
}

setTimeout(function(){
	initialTradesCheck()
}, 5000)

async function toggle(feature) {
	features = await getStorage("rpFeatures")
	featureBool = features[feature]
	if (featureBool) {
		features[feature] = false
	} else {
		features[feature] = true
	}
	await setStorage("rpFeatures", features)
}

setInterval(async function(){
	loadToken()
}, 120000)
loadToken()

setInterval(async function(){
	subscriptionManager.validateLicense()
}, 300000)
subscriptionManager.validateLicense()

function connectedNotification(notification) {
	var notificationOptions = {
		type: "basic",
		title: notification.subject,
		message: notification.message,
		priority: 2,
		iconUrl: "https://ropro.io/images/poweruser_icon.png"
	}
	chrome.notifications.create("", notificationOptions)
}

function generalNotification(notification) {
	console.log(notification)
	var notificationOptions = {
		type: "basic",
		title: notification.subject,
		message: notification.message,
		priority: 2,
		iconUrl: notification.icon
	}
	chrome.notifications.create("", notificationOptions)
}

function notificationValid(notification) {
	if (dealCalculations == "rap") {
		if (notification.rap >= valueThreshold) {
			return notification.rap_deal >= notificationThreshold
		}
	} else {
		if (notification.value >= valueThreshold) {
			return notification.value_deal >= notificationThreshold
		}
	}
}

async function notificationButtonClicked(notificationId, buttonIndex) { //Deal notification button clicked
	notification = notifications[notificationId]
	console.log(notification)
	if (notification['type'] == 'trade') {
		if (notification['tradeType'] == 'inboundTrades') {
			if (buttonIndex == 0) {
				chrome.tabs.create({ url: "https://www.roblox.com/trades" })
			} else if (buttonIndex == 1) {
				cancelTrade(notification['tradeid'], await getStorage('token'))
			}
		} else if (notification['tradeType'] == 'outboundTrades') {
			if (buttonIndex == 0) {
				chrome.tabs.create({ url: "https://www.roblox.com/trades#outbound" })
			} else if (buttonIndex == 1) {
				cancelTrade(notification['tradeid'], await getStorage('token'))
			}
		} else if (notification['tradeType'] == 'completedTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#completed" })
		} else if (notification['tradeType'] == 'inactiveTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#inactive" })
		}
	} else {
		if (buttonIndex == 0 && notification['buyButtons'].length == 2) {
			price = notification['price']
			myToken = await getStorage('token')
			userId = await getStorage('rpUserID')
			$.get('http://api.roblox.com/marketplace/productinfo?assetId=' + notification['id'], function(data){
				productId = data['ProductId']
				itemName = data['Name']
				$.get('https://economy.roblox.com/v1/users/' + userId + '/currency', function(robuxLevel) {
					if (robuxLevel.robux >= price) {
						$.get('https://economy.roblox.com/v1/assets/' + notification['id'] + '/resellers?cursor=&limit=10', function(data){
							if (data.data[0].price == price) {
								$.post("https://ropro.io/api/handlePurchase.php?userid=" + userId + "&assetid=" + notification['id'] + "&uaid=" + data.data[0].userAssetId + "&price=" + data.data[0].price, function(response) {
									if (response == "VALID_PURCHASE") {
										$.ajax({
											url: 'https://economy.roblox.com/v1/purchases/products/' + productId,
											type: 'POST',
											data: {'expectedCurrency': 1, 'expectedPrice': data.data[0].price, 'expectedSellerId': data.data[0].seller.id, 'userAssetId': data.data[0].userAssetId},
											headers: {'X-CSRF-TOKEN': myToken},
											success: function(data) {
												if (data.purchased == false) {
													$.ajax({
														url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
														success:function(result, status, xhr){
															itemIconUrl = result.data[0].imageUrl
															generalNotification({"subject": "Purchase Failed - " + itemName, "message": data.errorMsg, "icon": itemIconUrl})
														}
													})
												} else {
													$.ajax({
														url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
														success:function(result, status, xhr){
															itemIconUrl = result.data[0].imageUrl
															generalNotification({"subject": "Successfully Purchased - " + itemName, "message": "Purchased for R$" + price, "icon": itemIconUrl})
														}
													})
												}
											},
											error: function(data) {
												$.ajax({
													url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
													success:function(result, status, xhr){
														itemIconUrl = result.data[0].imageUrl
														generalNotification({"subject": "Purchase Failed - " + itemName, "message": "Item no longer for sale.", "icon": itemIconUrl})
													}
												})
											}
										})
									} else {
										$.ajax({
											url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
											success:function(result, status, xhr){
												itemIconUrl = result.data[0].imageUrl
												generalNotification({"subject": "Purchase Failed - " + itemName, "message": "Item no longer for sale.", "icon": itemIconUrl})
											}
										})
									}								
								})
							} else {
								$.ajax({
									url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
									success:function(result, status, xhr){
										itemIconUrl = result.data[0].imageUrl
										generalNotification({"subject": "Purchase Failed - " + itemName, "message": "Item no longer for sale.", "icon": itemIconUrl})
									}
								})
							}
						})
				} else {
					$.ajax({
						url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data['AssetId'] + "&size=420x420&format=Png&isCircular=false",
						success:function(result, status, xhr){
							itemIconUrl = result.data[0].imageUrl
							generalNotification({"subject": "Purchase Failed - " + itemName, "message": "You do not have enough Robux to purchase this item.", "icon": itemIconUrl})
							}
						})
					}
				})
			})
		} else if (buttonIndex == 1 || (buttonIndex == 0 && notification['buyButtons'].length == 1)) {
			chrome.tabs.create({ url: "https://www.roblox.com/catalog/" + notification['id'] + "/item" })
		}
	}
}

function notificationClicked(notificationId) {
	console.log(notificationId)
	notification = notifications[notificationId]
	console.log(notification)
	if (notification['type'] == 'trade') {
		if (notification['tradeType'] == 'inboundTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades" })
		}
		else if (notification['tradeType'] == 'outboundTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#outbound" })
		}
		else if (notification['tradeType'] == 'completedTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#completed" })
		}
		else if (notification['tradeType'] == 'inactiveTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#inactive" })
		}
	}
	if (notification['type'] == 'deal') {
		chrome.tabs.create({ url: "https://www.roblox.com/catalog/" + notification['id'] + "/item" })
	}
}

var buyButton = true;
var dealCalculations = "rap";
var notificationThreshold = 30;
var valueThreshold = 0;

async function checkDealSettings() {
	buyButton = await loadSettings("buyButton");
	dealCalculations = await loadSettings("dealCalculations");
	notificationThreshold = await loadSettings("notificationThreshold");
	valueThreshold = await loadSettings("valueThreshold");
}

function dealNotification(notification) {
	console.log(notification)
	if (notificationValid(notification)) {
		id = notification.id
		name = notification.name
		rap = notification.rap
		value = notification.value
		price = notification.price
		rap_deal = notification.rap_deal
		value_deal = notification.value_deal
		title = `${name}`
		if (dealCalculations == "rap") {
			message = `Deal:     ${rap_deal}% off RAP\nPrice:    ${addCommas(price)}\nRAP:     ${addCommas(rap)}\nValue:   ${addCommas(value)}`
		} else {
			message = `Deal:     ${value_deal}% off Value\nPrice:    ${addCommas(price)}\nRAP:     ${addCommas(rap)}\nValue:   ${addCommas(value)}`
		}
		async function dealNotify(id, price, rap, value, title, message) {
			$.ajax({
				url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + id + "&size=420x420&format=Png&isCircular=false",
				success:async function(result, status, xhr){
					itemIconUrl = result.data[0].imageUrl
					function checkProjected(id, price, rap, value, title, message, itemIconUrl) {
						$.get("https://economy.roblox.com/v1/assets/" + id + "/resellers?cursor=&limit=10", function(data){ 
							if (data.data.length > 1) {
								if (data.data[0].price == price && data.data[1].price >= rap * 0.9) {
									doNotify(id, price, rap, value, title, message, itemIconUrl)
									console.log("Notifying: " + id)
								} else {
									console.log("Projected Filter: " + id)
								}
							} else {
								doNotify(id, price, rap, value, title, message, itemIconUrl)
								console.log("Notifying: " + id)
							}
						})
					}
					function doNotify(id, price, rap, value, title, message, itemIconUrl) {
						if (buyButton) {
							buyButtons = [{title: "Buy"}, {title: "Open"}]
						} else {
							buyButtons = [{title: "Open"}]
						}
						var notificationOptions = {
							type: "basic",
							title: title,
							message: message,
							contextMessage: `${addCommas(price)} P / ${addCommas(rap)} R / ${addCommas(value)} V`,
							iconUrl: itemIconUrl,
							priority: 2,
							buttons: buyButtons
						}
						notificationId = Math.floor(Math.random() * 1000000).toString()
						notifications[notificationId] = {type: "deal", id: id, price: price, buyButtons: buyButtons}
						chrome.notifications.create(notificationId, notificationOptions)
					}
					async function doCheck(id, price, rap, value, title, message, itemIconUrl) {
						if (await loadSettings("projectedFilter")) {
							checkProjected(id, price, rap, value, title, message, itemIconUrl)
						} else {
							doNotify(id, price, rap, value, title, message, itemIconUrl)
							console.log("Notifying: " + id)
						}
					}
					doCheck(id, price, rap, value, title, message, itemIconUrl)
				}
			})
		}
		dealNotify(id, price, rap, value, title, message)
	}
}

chrome.notifications.onClicked.addListener(notificationClicked)

chrome.notifications.onButtonClicked.addListener(notificationButtonClicked)

function handleNotification(notification) {
	switch(notification.type) {
		case "connected":
			connectedNotification(notification);
			break;
		case "deal":
			dealNotification(notification);
			break;
	}
}

//WebSocket logic to listen for incoming notifications

var websocket;

async function createWebSocketConnection() {
    if((websocket == null || websocket == undefined) && 'WebSocket' in window && await loadSettings("dealNotifier")){
		subscriptionKey = await getStorage("subscriptionKey");
		userID = await getStorage("rpUserID");
		connect("ws://deals.ropro.io:8880?subscriptionKey=" + subscriptionKey + "&userID=" + userID);
    }
}

//Create a websocket connection to listen for notifications.
function connect(host) {
    if (websocket === undefined) {
        websocket = new WebSocket(host);
		console.log(websocket)
    }

    websocket.onopen = function() {
		console.log("opened")
/*         chrome.storage.local.get(["rpUserID"], function(user) {
            websocket.send(JSON.stringify({userLoginId: user}));
        }); */
    };

    websocket.onmessage = function (event) {
		console.log(event)
		try {
			var notification = JSON.parse(event.data);
			handleNotification(notification)
		} catch(err) {
			console.log("Notification Error.")
		}
    };

    //If the websocket is closed wait 5 seconds then create new connection
    websocket.onclose = function() {
		console.log("CLOSED")
        websocket = undefined;
		setTimeout(function() {
			createWebSocketConnection();
		}, 5000)
    };
};

//Close the websocket connection
function closeWebSocketConnection() {
    if (websocket != null || websocket != undefined) {
        websocket.close();
        websocket = undefined;
    }
}

createWebSocketConnection();
checkDealSettings();
setInterval(async function() {
	subscriptionLevel = await subscriptionManager.getSubscription()
	setStorage("rpSubscription", subscriptionLevel)
	if (await loadSettings("dealNotifier")) {
		checkDealSettings();
		createWebSocketConnection();
	} else {
		closeWebSocketConnection();
	}
}, 30000)

setInterval(function(){
	$.get("https://ropro.io/api/disabledFeatures.php", function(data) {
		disabledFeatures = data
	})
}, 300000)

async function initializeMisc() {
	avatarBackground = await getStorage('avatarBackground')
	if (typeof avatarBackground === "undefined") {
		await setStorage("avatarBackground", "default")
	}
}
initializeMisc()
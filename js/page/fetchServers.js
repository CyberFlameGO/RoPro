/**

RoPro (https://ropro.io) v1.3

The RoPro extension is developed by:
                               
,------.  ,--. ,-----.,------. 
|  .-.  \ |  |'  .--./|  .---' 
|  |  \  :|  ||  |    |  `--,  
|  '--'  /|  |'  '--'\|  `---. 
`-------' `--' `-----'`------' 
                            
Contact me:

Discord - Dice#1000
Email - dice@ropro.io
Phone - 650-318-1631

Write RoPro:

Dice Systems LLC
16192 Coastal Hwy
Lewes, Deleware 19958
United States

RoPro Terms of Service:
https://ropro.io/terms

RoPro Privacy Policy:
https://ropro.io/privacy-policy

© 2022 Dice Systems LLC
**/

var serverContainerInterval = setInterval(function(){ 
	serverContainer = document.getElementById('rbx-game-server-item-container')
	if (serverContainer != null) {
		servers = $('.rbx-game-server-item:not(.ropro-checked)')
		for (var i = 0; i < servers.length; i++) {
			var server = servers.get(i)
			try {
				var serverProps = angular.element(server).context[Object.keys(angular.element(server).context)[0]].memoizedProps.children[0].props.children[1].props
				var gameId = serverProps.gameId
				var placeId = serverProps.placeId
				if (gameId.length > 0) {
					server.setAttribute('data-gameid', gameId)
					server.setAttribute('data-placeid', gameId)
				}
			} catch(e) {
			}
			servers.get(i).classList.add('ropro-checked')
		}
	}
	serverContainer = document.getElementById('rbx-friends-game-server-item-container')
	if (serverContainer != null) {
		servers = $('.rbx-friends-game-server-item:not(.ropro-checked)')
		for (var i = 0; i < servers.length; i++) {
			var server = servers.get(i)
			try {
				var serverProps = angular.element(server).context[Object.keys(angular.element(server).context)[0]].memoizedProps.children[0].props.children[1].props
				var gameId = serverProps.gameId
				var placeId = serverProps.placeId
				if (gameId.length > 0) {
					server.setAttribute('data-gameid', gameId)
					server.setAttribute('data-placeid', gameId)
				}
			} catch(e) {
			}
			servers.get(i).classList.add('ropro-checked')
		}
	}
}, 1000)
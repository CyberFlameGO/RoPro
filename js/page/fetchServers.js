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
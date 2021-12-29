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

div = document.createElement('div')
div.classList.add('ropro-valid')
document.body.appendChild(div)

function activateKey(key) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/activateKey.php?key=" + key},
			function(data) {
				resolve(data)
			}
		)
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

$(document).ready(async function(){
	var checkSuccess = setInterval(async function() {
		if (document.getElementsByClassName('login-success').length > 0) {
			clearInterval(checkSuccess)
			key = document.getElementById('roProKey').value
			data = await activateKey(key)
			if (data == "success") {
				setStorage("subscriptionKey", key)
				location.reload()
			} else {
				location.reload()
			}
		}
	}, 500)
});
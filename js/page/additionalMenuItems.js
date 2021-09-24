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

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
}

function validateLicense() {
	chrome.runtime.sendMessage({greeting: "ValidateLicense"})
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

function fetchSubscription(setting) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetSubscription", setting: setting}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function openOptions() {
	chrome.runtime.sendMessage({greeting: "OpenOptions"})
}

async function checkAlerts() {
	alreadyAlerted = await getLocalStorage("alreadyAlerted")
	rpAlert = await getLocalStorage("rpAlert")
	if (typeof rpAlert != "undefined" && rpAlert.length > 0 && alreadyAlerted != rpAlert) {
		alertDiv = document.createElement('div')
		alertDiv.classList.add("alert-info")
		alertDiv.classList.add("linkify")
		alertDiv.style.display = rpAlert.split(";")[0];
		alertDiv.innerHTML = `<span>${rpAlert.substring(rpAlert.indexOf(';') + 1, rpAlert.length)}</span>`
		document.getElementsByClassName('alert-container')[0].appendChild(alertDiv)
		if (alertDiv.getElementsByClassName('alert-close').length > 0) {
			setTimeout(function() {
				alertDiv.getElementsByClassName('alert-close')[0].addEventListener('click', async function() { //User closed alert, dismiss message and don't show it again
					console.log("Close Alert")
					await setLocalStorage("alreadyAlerted", rpAlert)
					alreadyAlerted = await getLocalStorage("alreadyAlerted")
					alertDiv.remove()
				})
			}, 2000)
		}
	}
}

async function insertMenuItems() {
	while(!document.querySelector(".navbar-right.rbx-navbar-icon-group")) {
		await new Promise(r => setTimeout(r, 10));
	}
	if (await fetchSetting('roproIcon') && document.getElementsByClassName('nav navbar-right rbx-navbar-icon-group').length > 0) {
		subscription = await fetchSubscription()
		if (subscription.includes("free")) {
			subscriptionPrefix = "free"
			subscriptionName = "Free Tier"
		} else if (subscription.includes("standard")) {
			subscriptionPrefix = "standard"
			subscriptionName = "Standard Tier"
		} else if (subscription.includes("pro")) {
			subscriptionPrefix = "pro"
			subscriptionName = "Pro Tier"
		} else if (subscription.includes("ultra")) {
			subscriptionPrefix = "ultra"
			subscriptionName = "Ultra Tier"
		} else {
			subscriptionPrefix = "free"
			subscriptionName = "Free Tier"
		}
		li3 = document.createElement('li')
		li3.style.marginLeft = "6px"
		li3.classList.add('buttontooltip')
		li3.innerHTML = '<img class="ropro-icon" style="margin-top:6px;margin-left:0px;width:30px;" src="https://ropro.io/images/' + stripTags(subscriptionPrefix) + '_icon_shadow.png"><span style="margin-top:-5.5px;margin-left:3px;top:45px;left:-160px;width:190px;" class="tooltiptext"><p style="color:white;"><b>RoPro v1.2</b></p>' + stripTags(subscriptionName) + ' Active</span>'
		document.getElementsByClassName('nav navbar-right rbx-navbar-icon-group')[0].appendChild(li3)
		li3.addEventListener('click', function() {
			openOptions()
		})
	}
	offerLI = document.createElement('li')
	newButtonHTML = '<a class="sandbox-icon dynamic-overflow-container text-nav" href="/offers" id="nav-inventory"><div><span style="transform:scale(1.2);" class="new-menu-icon icon-nav-trade"></span></div><span class="font-header-2 dynamic-ellipsis-item">Trade Offers</span></a>'
	offerLI.innerHTML += newButtonHTML
	sandboxLI = document.createElement('li')
	newButtonHTML = '<a class="offers-icon dynamic-overflow-container text-nav" href="/sandbox" id="nav-inventory"><div><span class="new-menu-icon icon-nav-charactercustomizer"></span></div><span class="font-header-2 dynamic-ellipsis-item">Sandbox</span></a>'
	sandboxLI.innerHTML += newButtonHTML
	while(!document.querySelector(".left-col-list")) {
		await new Promise(r => setTimeout(r, 250));
	}
	menu = document.getElementsByClassName('left-col-list')[0]
	if (await fetchSetting('tradeOffersPage')) {
		menu.insertBefore(offerLI, menu.childNodes[7])
	}
	if (await fetchSetting('sandbox')) {
		menu.insertBefore(sandboxLI, menu.childNodes[5])
	}
	for (i = 0; i < document.getElementsByClassName('left-col-list')[0].getElementsByTagName('li').length; i++) {
		listItem = document.getElementsByClassName('left-col-list')[0].getElementsByTagName('li')[i]
		listItem.style.display = "block"
	}
	while(!document.querySelector(".nav-settings-icon")) {
		await new Promise(r => setTimeout(r, 250));
	}
	document.getElementById('settings-icon').addEventListener('click', function(){
		if(document.getElementsByClassName('ropro-settings-toggle').length == 0) {
			setTimeout(function(){
				settingsButtonHTML = `<a style="padding-left:5px;padding-right:5px;" class="rbx-menu-item ropro-settings-toggle">RoPro Settings</a>`
				liSettings = document.createElement('li')
				liSettings.innerHTML += settingsButtonHTML
				document.getElementById('settings-popover').style.left = parseFloat(document.getElementById('settings-popover').style.left) - 17 + "px"
				document.getElementById('settings-popover').getElementsByClassName('arrow')[0].style.left = "55.8%"
				document.getElementById('settings-popover-menu').insertBefore(liSettings, document.getElementById('settings-popover-menu').childNodes[0])
				liSettings.addEventListener('click', function() {
					openOptions()
				})
			}, 10)
		}
	})
}

insertMenuItems()

setTimeout(async function() {
    user = parseInt(document.getElementsByName('user-data')[0].attributes['data-userid'].value)
    if (!isNaN(user) && user != await getStorage('rpUserID')) {
		setStorage('rpUserID', user)
        validateLicense()
    }
	function checkAlertContainer() {
		if (typeof document.getElementsByClassName('alert-container')[0] != "undefined") {
			checkAlerts()
		} else {
			setTimeout(function() {
				checkAlertContainer()
			}, 100)
		}
	}
	checkAlertContainer()
}, 1)
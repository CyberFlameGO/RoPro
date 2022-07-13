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

function addThemeMain(theme) {
	console.log(theme)
	themeName = theme['name']
	profileThemeName = theme['name']
	if ('repeat' in theme){
		repeat = theme['repeat']
	} else {
		repeat = "repeat"
	}
	if ('width' in theme) {
		width = theme['width']
	} else {
		width = "100%"
	}
	if ('color' in theme) {
		color = theme['color']
	} else {
		color = ""
	}
	themeImages = theme['images'].split(",")
	var myInterval1 = setInterval(function(){
		mainContainer = document.getElementById('container-main')
		if (mainContainer == null) {
			return
		} else {
			clearInterval(myInterval1)
		}
		if (themeImages.length == 1) {
			mainContainer.style.backgroundImage = `url(${stripTags(themeImages[0])})`
			mainContainer.style.backgroundSize = width
		} else {
			mainContainer.style.backgroundImage = `url(${stripTags(themeImages[0])}), url(${stripTags(themeImages[1])})`
			mainContainer.style.backgroundPosition = "left top, right top"
			if (width == "100% 100%") {
				mainContainer.style.backgroundSize = "50% 100%"
			} else {
				mainContainer.style.backgroundSize = "50%"
			}
			if (repeat == "repeat") {
				repeat = "repeat-y"
			}
		}
		mainContainer.style.backgroundColor = color
		mainContainer.style.backgroundRepeat = repeat
		mainContainer.style.padding = "20px"
	}, 50)
	var myInterval2 = setInterval(function(){
		contentContainer = document.getElementsByClassName('content')
		if (contentContainer.length == 0) {
			return
		} else {
			clearInterval(myInterval2)
		}
		contentContainer = contentContainer[0]
		contentContainer.style.padding = "20px"
		contentContainer.style.borderRadius = "10px"
		if (window.location.href.includes('/home') || window.location.href.match('/games/[0-9]+/').length > 0) {
			contentContainer.style.maxWidth = "1000px"
		}
	}, 50)
	var myInterval3 = setInterval(function(){
		right = document.getElementById('Skyscraper-Abp-Right')
		left = document.getElementById('Skyscraper-Abp-Left')
		if (right == null && left == null) {
			return
		} else {
			clearInterval(myInterval3)
		}
		if (window.location.href.includes('/home') || window.location.href.match('/games/[0-9]+/').length > 0) {
			document.getElementById('Skyscraper-Abp-Right').style.marginRight = "-200px"
			document.getElementById('Skyscraper-Abp-Left').style.marginLeft = "-185px"
		}
	}, 50)
}

async function insertMenuItems() {
	tradeOffersPage = await fetchSetting('tradeOffersPage')
	sandbox = await fetchSetting('sandbox')
	offerLI = document.createElement('li')
	newButtonHTML = '<a class="offers-icon dynamic-overflow-container text-nav" href="/offers" id="nav-inventory"><div><span style="transform:scale(0.8);margin-top:-1px;" class="new-menu-icon icon-nav-trade"></span></div><span class="font-header-2 dynamic-ellipsis-item">Trade Offers</span></a>'
	offerLI.innerHTML += newButtonHTML
	sandboxLI = document.createElement('li')
	newButtonHTML = '<a class="sandbox-icon dynamic-overflow-container text-nav" href="/sandbox" id="nav-inventory"><div><span style="transform:scale(0.85);margin-left:1px;" class="new-menu-icon icon-nav-charactercustomizer"></span></div><span class="font-header-2 dynamic-ellipsis-item">Sandbox</span></a>'
	sandboxLI.innerHTML += newButtonHTML
	while(!document.querySelector(".left-col-list")) {
		await new Promise(r => setTimeout(r, 10));
	}
	menu = document.getElementsByClassName('left-col-list')[0]
	if (tradeOffersPage) {
		menu.insertBefore(offerLI, menu.childNodes[7])
	}
	if (sandbox) {
		menu.insertBefore(sandboxLI, menu.childNodes[5])
	}
	for (i = 0; i < document.getElementsByClassName('left-col-list')[0].getElementsByTagName('li').length; i++) {
		listItem = document.getElementsByClassName('left-col-list')[0].getElementsByTagName('li')[i]
		listItem.style.display = "block"
		if (listItem.getElementsByTagName('a').length > 0) {
			listItem.getElementsByTagName('a')[0].style.display = ""
		}
	}
	while(!document.querySelector(".navbar-right.rbx-navbar-icon-group")) {
		await new Promise(r => setTimeout(r, 10));
	}
	console.log('loaded')
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
		li3.innerHTML = '<img class="ropro-icon" style="margin-top:3.5px;margin-left:0px;width:30px;" src="' + chrome.runtime.getURL('/images/' + stripTags(subscriptionPrefix) + '_icon_shadow.png') + '"><span style="margin-top:-5.5px;margin-left:3px;top:45px;left:-160px;width:190px;" class="tooltiptext"><p style="color:white;"><b>RoPro v1.3</b></p>' + stripTags(subscriptionName) + ' Active</span>'
		document.getElementsByClassName('nav navbar-right rbx-navbar-icon-group')[0].appendChild(li3)
		li3.addEventListener('click', function() {
			openOptions()
		})
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
		console.log("Updating UserID")
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
	if (!window.location.href.includes('/profile') && await fetchSetting('globalThemes')) {
		theme = await getStorage('globalTheme')
		if (typeof theme != 'undefined' && theme != null) {
			addThemeMain(JSON.parse(theme))
		}
	}
}, 1)
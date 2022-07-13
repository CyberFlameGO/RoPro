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



profileThemeBoxHTML = `<div class="section-content"><p id="themeResponseText"></p><div style="width:100%;float:left;margin-top:0px;height:auto;background-color:${$('.dark-theme').length > 0 ? '#232527' : '#F2F4F5'};padding:20px;padding-bottom:0px;border-radius:10px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;"><h3 style="margin-bottom:-10px;">Default Profile Themes</h3><h7 style="font-size:14px;margin-top:-10px;">${chrome.i18n.getMessage("OtherRoproUsersWillSeeYourThemeWhenTheyVisitYourProfile")}</h7><button id="saveTheme" type="button" class="btn-fixed-width-lg btn-growth-lg" style="background-color:#0084dd;border:0px;font-size:18px;padding:5px;margin-top:-10px;float:right;">${chrome.i18n.getMessage("RemoveTheme")}</button><br><br></div><div style="width:100%;height:auto;float:left;min-height:171px;background-color:${$('.dark-theme').length > 0 ? '#232527' : '#F2F4F5'};padding:0px;padding-bottom:20px;padding-left:10px;border-radius-top:0px;border-bottom-left-radius:10px;border-bottom-right-radius:10px;" id="profileThemeCardBox"></div><br><br><div style="width:100%;float:left;margin-top:20px;margin-bottom:20px;background-color:${$('.dark-theme').length > 0 ? '#232527' : '#F2F4F5'};padding:20px;border-radius:10px;display:none;"><h3 style="margin-top:5px;margin-bottom:-10px;">Custom Profile Themes<div style="display:inline-block;font-size:10px;vertical-align:top;margin-top:2px;margin-left:3px;"> BETA</div></h3><h7 style="font-size:14px;margin-top:-10px;">Use Roblox decals to create custom profile themes. </h7><p style="font-size:11px;margin-top:5px;">• Scaling, repetition, and background color are fully customizable.<br>• Other RoPro users will see your custom theme when they visit your profile. <br>• Any Roblox decal you use for a theme must be publicly available and not violate the <a href="https://roblox.com/info/terms"><u>Roblox</u></a> or <a href="https://ropro.io/terms/"><u>RoPro</u></a> Terms of Service. <br>• Equipping a Roblox decal which violates the <a href="https://en.help.roblox.com/hc/en-us/articles/203313410-Roblox-Community-Standards"><u>Roblox Community Standards</u></a> will result in a suspension or ban from using RoPro Custom Themes. <br>• You can report profile themes to RoPro moderation by clicking 'Report Profile Theme' next to the Report Abuse button.</p><br>
<div style="position:relative;height:auto;"><div id="customThemeOuter" class="import-decal-outer" style="padding:0px;padding-left:0px;padding-right:0px;width:auto;margin-left:0px;margin-top:-10px;overflow:hidden;">
<div style="margin-top:-10px;margin-bottom:10px;height:240px;min-height:110px;position:relative;" id="customThemeBox">
    <div style="height:200px;width:920px;transform:scale(0.7);float:left;margin-left:-100px;margin-right:-320px;padding-right:-50px;"><div id="decalScrollLeft" style="display:block;transform:scale(0.8);margin-top:-20px;" class="scroller prev disabled" role="button" aria-hidden="true"><div class="arrow"><span class="icon-games-carousel-left"></span></div></div><div id="decalSearchResults" style="width:900px;height:200px;"><span style="transform:scale(1.25);display: inline-block; width: 200px; height: 25px; visibility: initial !important;margin:auto;margin-left:220px;margin-top:65px;" id="customThemeLoader" class="spinner spinner-default"></span></div><div id="decalScrollRight" style="transform:scale(0.8);margin-top:-20px;left:650px;" class="scroller next disabled" role="button" aria-hidden="true"><div class="arrow"><span class="icon-games-carousel-right"></span></div></div><input id="decalSearch" style="width:650px;height:auto;" class="form-control input-field" placeholder="Search decal name or directly enter a decal's Roblox ID..." value=""><div style="margin-top:5px;margin-left:5px;"><a target="_blank" href="https://www.roblox.com/develop/library?CatalogContext=2&amp;SortAggregation=5&amp;LegendExpanded=true&amp;Category=8"><b>+ Find More Decal IDs</b></a><a style="margin-left:15px;" target="_blank" href="https://www.roblox.com/develop?View=13"><b>+ Upload Decals</b></a></div></div><div style="height:200px;width:360px;margin-top:20px;;float:right;border-left: 2px solid #656668;padding:20px;"><div style="display:inline-block;float:left;"><div class="item-card-thumb-container">
	<thumbnail-2d class="item-card-thumb "><span style="width:100%; height:100%;" class="thumbnail-2d-container"> <img id="selectedDecal" class="ng-scope ng-isolate-scope" title="" alt="" style="background-color:#656668;" default-src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="></span> </thumbnail-2d>
</div><div id="selectedDecalName" style="font-size:12px;font-weight:bold;text-align:center;width:126px;">Resolution: <br>256 x 256</div></div><div style="float:right;"><div style="font-size:12px;margin-left:5px;">Decal Width (%):
</div><input id="percentFill" placeholder="Width (%)" class="form-control input-field" style="font-size:10px;" type="number" value=10 max="100" min="1"><div style="font-size:12px;margin-left:5px;margin-top:5px;">Background Color:
<br></div>
<input id="colorHex" placeholder="Color Hex (#FFFFF)" class="form-control input-field" style="font-size:10px;"><a target="_blank" href="https://htmlcolorcodes.com"><img style="position:absolute;width:20px;right:-2px;margin-top:-26px;" src="${chrome.runtime.getURL('/images/info_icon.png')}"></a>
<div style="margin-left:5px;font-size:12px;margin-top:5px;" class="checkbox">
  <input id="repeatDecal" checked="true" type="checkbox">
  <label for="repeatDecal"> Repeat Decal</label>
</div>
</div>
</div>
</div>
</div>
<li class="rbx-upgrade-now" id="customThemeCTA" style="width:400px;text-align:center;display:none;z-index:10000!important;position:absolute;top:80px;left:calc(50% - 200px);"><span style="font-weight:bold;font-size:18px;margin-right:5px;"><img src="${chrome.runtime.getURL('/images/standard_icon_shadow.png')}" style="width:40px;margin-top:-3px;margin-right:5px;">Standard Tier Feature</span><br><a style="margin-left:0px;width:150px;margin-top:15px;" target="_blank" href="https://ropro.io/?upgrade" class="btn-growth-md btn-secondary-md" id="upgrade-now-button">Upgrade RoPro</a></li>
</div>
</div>
<div style="width:100%;float:left;margin-top:20px;height:auto;margin-bottom:20px;background-color:${$('.dark-theme').length > 0 ? '#232527' : '#F2F4F5'};padding:20px;border-radius:10px;padding-bottom:10px;"><h3 style="margin-bottom:-10px;">Toggle Global Themes<div style="display:inline-block;font-size:10px;vertical-align:top;margin-top:2px;margin-left:3px;"> BETA</div></h3><h7 style="font-size:14px;margin-top:-10px;">Display your theme across all Roblox pages.</h7>
<button style="float:right;transform:scale(1.2);margin-right:5px;margin-top:-5px;border-radius:7px;" id="global-themes-toggle" class="ropro-toggle btn-toggle">
<span class="toggle-flip" style="border-radius:7px;"></span>
<span id="toggle-on" class="toggle-on"></span>
<span id="toggle-off" class="toggle-off"></span>
</button><br><br></div>
<div>• Due to Roblox security policy changes which restrict access to images &amp; GIFs hosted offsite, equipping animated themes is no longer possible.<br>•<b> <u>Coming Soon</u></b>: RoPro subscribers will be able to create and equip custom themes!</div>
</div>`

var ropro_themes = null
var profileThemeName = null
var themeDivs = []
var decalDivs = []

function fetchThemes() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.ropro.io/getDefaultThemes.php"},
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchTheme(userID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.ropro.io/getProfileTheme.php?userid=" + userID}, 
			function(data) {
				resolve(data)
			}
		)
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

function fetchDecals(keyword) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://search.roblox.com/catalog/json?CatalogContext=2&Subcategory=8&Keyword=" + keyword + "&SortAggregation=5&PageNumber=1&LegendExpanded=true&Category=8"}, 
			function(data) {
				resolve(data)
			}
		)
	})
} 

function fetchDecalImageId(decalId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.ropro.io/getDecalImage.php?id=" + decalId}, 
			function(data) {
				resolve(data)
			}
		)
	})
} 

function updateGlobalTheme() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "UpdateGlobalTheme"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function saveTheme(userID, themeName, remove) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.ropro.io/saveProfileTheme.php?userid=" + userID + "&themename=" + themeName},
			function(data) {
				resolve(data)
			}
		)
	})
}

function getUserId() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetUserID"}, 
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

function checkVerification() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "CheckVerification"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
}

function addCard(theme) {
	profileThemeCardHTML = `<div themejson='${encodeURI(JSON.stringify(theme))}' style="display:inline-block;width:48px;height:48px;margin:2px;margin-left:5px;margin-right:5px;margin-bottom:5px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
<img class="item-card-thumb-container" style="width:100%;height:100%;" src="${stripTags(theme['thumbnail'])}">
<img src="${chrome.runtime.getURL('/images/empty.png')}" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
</a></div>`
	div = document.createElement('div')
	div.innerHTML += profileThemeCardHTML
	if ('animated' in theme) {
		// Animated themes removed.
		return
	} else {
		profileThemeCardBox = document.getElementById('profileThemeCardBox')
		themeDivs.push(div)
		if (themeDivs.length > 151) {
			div.style.display = "none"
		}
	}
	profileThemeCardBox.appendChild(div)
	$(div).click(function(){
		theme = JSON.parse(decodeURI(this.getElementsByClassName('thumbnail-2d-container')[0].getAttribute('themejson')))
		console.log(theme)
		addTheme(theme)
	})
}

async function doThemeResponse(response){
	responseElement = document.getElementById('themeResponseText')
	responseElement.style.marginBottom = "10px"
	if (response == "ERROR: NOT SUBSCRIBED") {
		responseElement.innerHTML = 'Error: Animated themes are only available for subscribers. <a style="display:inline-block;" class="btn-primary-md ng-binding" target="_blank" href="https://ropro.io#standard">Upgrade</a>'
	} else if(response == "SUCCESSFULLY REMOVED") {
		responseElement.innerHTML = 'Successfully removed profile theme. Other users will not see a theme on your profile!'
		await setStorage("globalTheme", "")
	} else if(response == "SUCCESS") {
		responseElement.innerHTML = 'Successfully updated profile theme. Other users will be able to see your theme now!'
		var myId = await getStorage('rpUserID')
		if (typeof myId != "undefined" && await getStorage('globalThemesToggle')) {
			data = await fetchTheme(parseInt(myId))
			if (data.theme != null) {
				await setStorage("globalTheme", data.theme)
			}
		}
	} else if(response.startsWith("ERROR_INFO: ")) {
		responseText = response.replace("ERROR_INFO: ", "")
		responseElement.innerHTML = stripTags(responseText)
	} else {
		responseElement.innerHTML = 'Error: Unknown error, please try again later.'
	}
}

async function addThemeBox() {
	profileContainer = document.getElementsByClassName('profile-container')[0]
	profileHeader = profileContainer.getElementsByClassName('profile-header')[0]
	div = document.createElement('div')
	div.setAttribute('id', 'profileThemesSelectorBox')
	div.setAttribute('class', 'profile-selector-box')
	div.innerHTML += profileThemeBoxHTML
	profileHeader.parentNode.insertBefore(div, profileHeader.nextElementSibling)
	document.getElementById('saveTheme').addEventListener("click", async function(){
		if (await checkVerification()) {
			if (this.innerHTML == chrome.i18n.getMessage("SaveTheme")) {
				responseElement = document.getElementById('themeResponseText').innerHTML = ""
				backgroundImage = document.getElementById('container-main').style.backgroundImage
				userID = await getStorage("rpUserID")
				response = await saveTheme(userID, profileThemeName)
				doThemeResponse(response)
				this.innerHTML = chrome.i18n.getMessage("RemoveTheme")
				if (await fetchSetting('globalThemes')) {
					updateGlobalTheme()
				}
			} else {
				userID = await getStorage("rpUserID")
				response = await saveTheme(userID, "remove")
				doThemeResponse(response)
				document.getElementById('container-main').style.backgroundImage = ""
				document.getElementById('container-main').style.backgroundColor = ""
			}
		} else {
			alert("You must verify your user with RoPro at roblox.com/home before updating your profile theme.")
		}
	})
	if (await fetchSetting('globalThemes')) {
		document.getElementById('global-themes-toggle').classList.add('on')
	}
	document.getElementById('global-themes-toggle').addEventListener('click', async function() {
		document.getElementById('global-themes-toggle').classList.toggle('on')
		if (!document.getElementById('global-themes-toggle').classList.contains('on')) {
			settings = await getStorage("rpSettings")
			settings["globalThemes"] = false
			console.log(settings)
			setStorage("rpSettings", settings)
		} else {
			settings = await getStorage("rpSettings")
			settings["globalThemes"] = true
			console.log(settings)
			setStorage("rpSettings", settings)
			updateGlobalTheme()
		}
	})
}

function addTheme(theme) {
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
	mainContainer = document.getElementById('container-main')
	profileContainer = document.getElementsByClassName('profile-container')[0]
	profileContainer.style.padding = "20px"
	profileContainer.style.paddingTop = "10px"
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
	mainContainer.style.borderRadius = "20px"
	mainContainer.style.padding = "20px"
	document.getElementById('saveTheme').innerHTML = chrome.i18n.getMessage("SaveTheme")
	if (document.getElementById('accoutrements-slider') != null) {
		document.getElementById('accoutrements-slider').setAttribute('style', 'width:470px;transform:scale(0.95);margin-left:-7px;')
	}
	contentContainer = document.getElementsByClassName('content')
	contentContainer = contentContainer[0]
	contentContainer.style.borderRadius = "10px"
}

var curr_decal_page = 0

async function addDecals(keyword) {
	document.getElementById('decalSearchResults').innerHTML = `<span style="transform:scale(1.25);display: inline-block; width: 200px; height: 25px; visibility: initial !important;margin:auto;margin-left:220px;margin-top:65px;" class="spinner spinner-default"></span>`
	decalResults = await fetchDecals(keyword)
	console.log(decalResults)
	document.getElementById('decalSearchResults').innerHTML = ``
	curr_decal_page = 0
	decalDivs = []
	for (i = 0; i < decalResults.length; i++) {
		decal = decalResults[i]
		div = document.createElement('div')
		div.innerHTML = `<li class="item-card" style="float:left;height:200px;">
							<div style="display:inline-block;" class="item-card-container">
								<a decal-id="${parseInt(decal.AssetId)}" class="item-card-link">
									<div class="item-card-thumb-container">
										<thumbnail-2d class="item-card-thumb "><span style="width:100%; height:100%;" class="thumbnail-2d-container"> <img src="${stripTags(decal.ThumbnailUrl)}" class="ng-scope ng-isolate-scope" title="" alt=""></span> </thumbnail-2d>
									</div>
									<div class="text-overflow item-card-name">${stripTags(decal.Name)}</div>
								</a>	
							</div>
						</li>`
		decalDiv = div.childNodes[0]
		if (i >= 5) {
			if (i == 5) {
				document.getElementById('decalScrollRight').classList.remove('disabled')
			}
			decalDiv.style.display = "none"
		}
		document.getElementById('decalSearchResults').appendChild(decalDiv)
		decalDivs.push(decalDiv)
		decalDiv.getElementsByClassName('item-card-link')[0].addEventListener('click', async function() {
			decalId = parseInt(this.getAttribute('decal-id'))
			decalImageId = await fetchDecalImageId(decalId)
			if (isPositiveInteger(decalImageId)) {
				document.getElementById('selectedDecal').src = `https://assetdelivery.roblox.com/v1/asset?id=${parseInt(decalImageId)}`
				document.getElementById('selectedDecal').setAttribute('active', 'true')
				document.getElementById('selectedDecal').setAttribute('decal-id', parseInt(decalId))
				document.getElementById('selectedDecal').setAttribute('decal-image-id', parseInt(decalImageId))
			}
		})
	}
}

function isPositiveInteger(n) {
    return !isNaN(parseInt(n)) && parseInt(n).toString() == n
}

function isHex(hex) {
	hex = hex.replace("#", "")
	return typeof hex === 'string'
	&& hex.length === 6
	&& !isNaN(Number('0x' + hex))
}

var curr_theme_page = 0

async function loadThemes() {
	ropro_themes = await fetchThemes()
	themeDivs = []
	addThemeBox()
	for (i = 0; i < ropro_themes.length; i++){
		theme = ropro_themes[i]
		addCard(theme)
	}
	pager = document.createElement('div')
	pager.innerHTML = `<div style="width:100%;float:left;margin-top:0px;height:auto;background-color:${$('.dark-theme').length > 0 ? '#232527' : '#F2F4F5'};border-bottom-left-radius:10px;border-bottom-right-radius:10px;"><ul style="float:left;margin-left:calc(50% - 1151px/2);margin-top:10px;display:none;" class="pager" data-toggle="pager"><li id="roproThemePagerPrev" class="pager-prev disabled"><a href="#"><span class="icon-left"></span></a></li><li class="pager-cur"><span style="width:10px;" id="ropro-current-page">1</span></li><li class="pager-total"><span>of</span><a>${parseInt(Math.ceil(themeDivs.length / 151))}</a></li><li id="roproThemePagerNext" class="pager-next"><a href="#"><span class="icon-right"></span></a></li></ul></div>`
	document.getElementById('profileThemeCardBox').parentNode.insertBefore(pager.childNodes[0], document.getElementById('profileThemeCardBox').nextElementSibling)
	document.getElementById('roproThemePagerNext').addEventListener('click', function() {
		if (!(curr_theme_page * 151 + 151 > themeDivs.length)) {
			curr_theme_page++
			document.getElementById('roproThemePagerPrev').classList.remove('disabled')
			document.getElementById('ropro-current-page').innerText = parseInt(curr_theme_page + 1)
			if (curr_theme_page * 151 + 151 > themeDivs.length) {
				this.classList.add('disabled')
			}
			for (i = 0; i < themeDivs.length; i++) {
				themeDivs[i].style.display = "none"
			}
			for (i = curr_theme_page * 151; i < Math.min(curr_theme_page * 151 + 151, themeDivs.length); i++) {
				themeDivs[i].style.display = "block"
			}
		}
	})
	document.getElementById('roproThemePagerPrev').addEventListener('click', function() {
		if (curr_theme_page * 151 - 151 >= 0) {
			curr_theme_page--
			document.getElementById('roproThemePagerNext').classList.remove('disabled')
			document.getElementById('ropro-current-page').innerText = parseInt(curr_theme_page + 1)
			if (!(curr_theme_page * 151 - 151 >= 0)) {
				this.classList.add('disabled')
			}
			for (i = 0; i < themeDivs.length; i++) {
				themeDivs[i].style.display = "none"
			}
			for (i = curr_theme_page * 151; i < Math.min(curr_theme_page * 151 + 151, themeDivs.length); i++) {
				themeDivs[i].style.display = "block"
			}
		}
	})
	if (await fetchSetting('customProfileThemes')) {
		document.getElementById('customThemeOuter').style.filter = "initial"
		document.getElementById('customThemeOuter').style.backgroundColor = "initial"
		document.getElementById('customThemeBox').style.filter = "initial"
		document.getElementById('customThemeBox').style.pointerEvents = "initial"
		document.getElementById('customThemeCTA').remove()
		addDecals("tileable")
	} else {
		document.getElementById('customThemeLoader').remove()
	}
	$("#decalSearch").on('keyup', async function (e) {
		if (e.key === 'Enter' || e.keyCode === 13) {
			if (isPositiveInteger(this.value)) {
				decalImageId = await fetchDecalImageId(parseInt(this.value))
				if (isPositiveInteger(decalImageId)) {
					document.getElementById('selectedDecal').src = `https://assetdelivery.roblox.com/v1/asset?id=${parseInt(decalImageId)}`
					document.getElementById('selectedDecal').setAttribute('active', 'true')
					document.getElementById('selectedDecal').setAttribute('decal-id', parseInt(this.value))
					document.getElementById('selectedDecal').setAttribute('decal-image-id', parseInt(decalImageId))
				}
			} else {
				addDecals(stripTags(this.value))
			}
		}
	})
	document.getElementById('decalScrollRight').addEventListener('click', function() {
		if (!(curr_decal_page * 5 + 5 > decalDivs.length)) {
			curr_decal_page++
			document.getElementById('decalScrollLeft').classList.remove('disabled')
			if (curr_decal_page * 5 + 5 > decalDivs.length) {
				this.classList.add('disabled')
			}
			for (i = 0; i < decalDivs.length; i++) {
				decalDivs[i].style.display = "none"
			}
			for (i = curr_decal_page * 5; i < Math.min(curr_decal_page * 5 + 5, decalDivs.length); i++) {
				decalDivs[i].style.display = "block"
			}
		}
	})
	document.getElementById('decalScrollLeft').addEventListener('click', function() {
		if (curr_decal_page * 5 - 5 >= 0) {
			curr_decal_page--
			document.getElementById('decalScrollRight').classList.remove('disabled')
			if (!(curr_decal_page * 5 - 5 >= 0)) {
				this.classList.add('disabled')
			}
			for (i = 0; i < decalDivs.length; i++) {
				decalDivs[i].style.display = "none"
			}
			for (i = curr_decal_page * 5; i < Math.min(curr_decal_page * 5 + 5, decalDivs.length); i++) {
				decalDivs[i].style.display = "block"
			}
		}
	})
	document.getElementById('selectedDecal').addEventListener('load', function() {
		if (this.getAttribute('active') == 'true') {
			if (document.getElementById('percentFill').value > 25 && document.getElementById('selectedDecal').naturalWidth < 500) {
				document.getElementById('percentFill').value = 25
				alert("This decal is too low quality. To set the decal width more than 25% please use a decal that is at least 500 pixels wide.")
			}
			if (document.getElementById('percentFill').value > 50 && document.getElementById('selectedDecal').naturalWidth < 1000) {
				document.getElementById('percentFill').value = 50
				alert("This decal is too low quality. To set the decal width more than 50% please use a decal that is at least 1000 pixels wide.")
			}
			document.getElementById('container-main').style.backgroundImage = `url(https://assetdelivery.roblox.com/v1/asset?id=${parseInt(this.getAttribute('decal-image-id'))})`
			document.getElementById('container-main').style.backgroundRepeat = document.getElementById('repeatDecal').checked ? "repeat" : "no-repeat"
			document.getElementById('container-main').style.backgroundSize = isPositiveInteger(document.getElementById('percentFill').value.replace("%", "")) ? parseInt(document.getElementById('percentFill').value.replace("%", "")) + "%" : "10%"
			document.getElementById('container-main').style.backgroundColor = isHex(document.getElementById('colorHex').value) ? "#" + document.getElementById('colorHex').value.replace("#", "").substring(0, 6) : "transparent"
			document.getElementById('container-main').style.backgroundPosition = "top right"
			document.getElementById('selectedDecalName').innerText = "Resolution: \n" + document.getElementById('selectedDecal').naturalWidth + " x " + document.getElementById('selectedDecal').naturalHeight
		}
	})
	document.getElementById('percentFill').addEventListener('input', function() {
		this.value = parseInt(this.value)
		if (this.value > 100) {
			this.value = 100
		}
		if (this.value > 25 && document.getElementById('selectedDecal').naturalWidth < 500) {
			this.value = 25
			alert("This decal is too low quality. To set the decal width more than 25% please use a decal that is at least 500 pixels wide.")
		}
		if (this.value > 50 && document.getElementById('selectedDecal').naturalWidth < 1000) {
			this.value = 50
			alert("This decal is too low quality. To set the decal width more than 50% please use a decal that is at least 1000 pixels wide.")
		}
		document.getElementById('container-main').style.backgroundSize = isPositiveInteger(document.getElementById('percentFill').value.replace("%", "")) ? parseInt(document.getElementById('percentFill').value.replace("%", "")) + "%" : "10%"
	})
	document.getElementById('repeatDecal').addEventListener('click', function() {
		document.getElementById('container-main').style.backgroundRepeat = document.getElementById('repeatDecal').checked ? "repeat" : "no-repeat"
	})
	document.getElementById('colorHex').addEventListener('input', function() {
		document.getElementById('container-main').style.backgroundColor = isHex(document.getElementById('colorHex').value) ? "#" + document.getElementById('colorHex').value.replace("#", "").substring(0, 6) : "transparent"
	})
}

function addOpenThemesButton(){
	div = document.createElement('div')
	div.setAttribute("class", "profile-themes-button")
	div.innerHTML += `<a id="openThemes" style="margin-left:10px;display:inline-block;" class="btn-primary-md ng-binding">Themes<img style="margin:-5px;margin-top:-7px;margin-right:-2px;margin-left:3px;width:20px;" src="${chrome.runtime.getURL(`/images/paint_icon_${$('.light-theme').length == 0 ? "dark":"light"}.png`)}"></a>`
	document.getElementsByClassName('header-title')[0].appendChild(div)
	document.getElementById('openThemes').addEventListener('click', function(){
		if (this.innerHTML == `Themes<img style="margin:-5px;margin-top:-7px;margin-right:-2px;margin-left:3px;width:20px;" src="${chrome.runtime.getURL(`/images/paint_icon_${$('.light-theme').length == 0 ? "dark":"light"}.png`)}">`) {
			loadThemes()
			this.innerHTML = `Close Themes<img style="margin:-5px;margin-top:-7px;margin-right:-2px;margin-left:3px;width:20px;" src="${chrome.runtime.getURL(`/images/paint_icon_${$('.light-theme').length == 0 ? "dark":"light"}.png`)}">`
		} else {
			this.innerHTML = `Themes<img style="margin:-5px;margin-top:-7px;margin-right:-2px;margin-left:3px;width:20px;" src="${chrome.runtime.getURL(`/images/paint_icon_${$('.light-theme').length == 0 ? "dark":"light"}.png`)}">`
			document.getElementById('profileThemesSelectorBox').remove()
		}
	})
}

function getIdFromURL(url) {
	return parseInt(url.split("users/")[1].split("/profile")[0])
}

async function themesMain(){
	myUserID = await getStorage("rpUserID")
	pageID = getIdFromURL(location.href)
	if (myUserID == pageID && await fetchSetting('profileThemes')) {
		addOpenThemesButton()
	}
}

themesMain()

window.addEventListener("message", (event) => {
	console.log(event)
});
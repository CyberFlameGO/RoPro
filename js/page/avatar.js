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

var fetchAvatar = document.createElement('script');
fetchAvatar.src = chrome.extension.getURL('/js/page/fetchAvatar.js');
(document.head||document.documentElement).appendChild(fetchAvatar);
fetchAvatar.onload = function() {
    fetchAvatar.remove();
}

var wearingHTML = `<div style="float:left;position:relative;width:277px;margin-bottom:20px;" id="wearing">
<h5 style="padding-bottom:0px;" class="ng-binding"><span class="outfitCostText">Outfit Cost:</span> <span>
	<span id="outfitCostLoading" style="margin:-7px;transform: scale(0.6); width: 100px; height: 25px; visibility: initial !important;" class="spinner spinner-default"></span>
	<div id="outfitCostDiv" style="display:none;">
	<span style="margin-left:-5px;margin-right:-8px;margin-bottom:2px;transform: scale(0.6);" id="nav-robux" class="icon-robux-28x28 roblox-popover-close"></span>
	<span style="font-size:15px;" class="rbx-text-navbar-right text-header" id="outfitCostRobux">
</span></div></span>
</h5>
<h3 style="padding-bottom:0px;" class="ng-binding currentlyWearingText">Currently Wearing</h3>
<p style="margin-top:-2px;font-size:13px;display:inline-block;" class="ng-binding clickAnItemText">Click an item to unequip it.</p>
<div style="display:inline-block;width:14px;height:14px;margin-bottom:2px;cursor:pointer;font-size:10px;align:right;margin-right:55px;right:-5px;top:50px;transform:scale(0.9);margin-left:0px;" id="refreshAvatar"><div style="margin-left:38px;" class="rbx-refresh refresh-link-icon"></div>Redraw</div>
<div style="line-height:0px;pointer-events:initial;margin-top:5px;" id="wearingContainer"><span>
	<span id="outfitCostLoading" style="margin:0px;transform: scale(0.8); width: 100px; height: 25px; visibility: initial !important;" class="spinner spinner-default"></span>
	<div id="outfitCostDiv" style="display:none;">
	<span style="margin-left:-5px;margin-right:-8px;margin-bottom:2px;transform: scale(0.6);" id="nav-robux" class="icon-robux-28x28 roblox-popover-close"></span>
	<span style="font-size:15px;" class="rbx-text-navbar-right text-header" id="outfitCostRobux">
</span></div></span></div>
<h3 style="padding-bottom:0px;margin-top:5px;" class="ng-binding backgroundText">Background
<button id="saveBackgroundButton" type="button" class="btn-fixed-width-lg btn-growth-lg" style="margin-top:7px;background-color:#0084dd;border:0px;width:130px;font-size:12px;padding:2px;float:right;display:none;">Save Background</button>
</h3>
</div>`

var backgroundContainerHTML = `<div style="line-height:0px;pointer-events:initial;margin-top:5px;position:relative;" id="backgroundContainer">
<div style="top:-17px;right:-15px;margin-top: 0px; height: 100px; width: 20px; display: block; position:absolute;transform:scale(0.7);" class="scroller next backgrounds-scroll-right" role="button" aria-hidden="true"><div style="transform:scale(0.8);margin-right:-9px;" class="arrow"><span class="icon-games-carousel-right"></span></div></div>
<div style="top:-17px;left:-20px;margin-top: 0px; height: 100px; width: 20px; display: block; position:absolute;transform:scale(0.7);" class="scroller prev disabled backgrounds-scroll-left" role="button" aria-hidden="true"><div class="arrow"><span style="transform:scale(0.8);margin-left:-4px;" class="icon-games-carousel-left"></span></div>
</div>`
var wearing = []
var wearingCostDict = {}
var wearingInfoDict = {}
var backgrounds = ["default"]
var backgroundsPage = 0
var avatarBackground = "default"
var savedAvatarBackground = "default"

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

function fetchInventory(userId, cursor, type) {
	assetTypes = "Head,Face,RightArm,LeftArm,LeftLeg,RightLeg"
	if (type == "accessories") {
		assetTypes = "HairAccessory,FaceAccessory,NeckAccessory,ShoulderAccessory,FrontAccessory,BackAccessory,WaistAccessory"
	} else if (type == "hats gear") {
		assetTypes = "Hat,Gear"
	} else if (type == "clothes") {
		assetTypes = "TShirt,Shirt,Pants,TShirtAccessory,ShirtAccessory,PantsAccessory"
	} else if (type == "new clothes") {
		assetTypes = "JacketAccessory,SweaterAccessory,ShortsAccessory,LeftShoeAccessory,RightShoeAccessory"
	}
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:'https://inventory.roblox.com/v2/users/' + userId + '/inventory?assetTypes=' + assetTypes + '&limit=100&sortOrder=Asc&cursor=' + cursor}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchAssetDetails(assetId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.roblox.com/marketplace/productinfo?assetId=" + assetId}, 
			function(data) {
					resolve(data)
			})
	})
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
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

function totalOutfitCost() {
	total = 0
	offsale = 0
	for (i2 in wearing) {
		if (wearingCostDict[wearing[i2]] != null) {
			total += wearingCostDict[wearing[i2]]
		} else {
			offsale += 1
		}
	}
	return [total, offsale]
}

function fetchCurrentlyWearing(userId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://avatar.roblox.com/v1/users/"+userId+"/avatar"}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchBackgrounds() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getAvatarBackgrounds.php"}, 
			function(data) {
					resolve(data.split(","))
			})
	})
}

function fetchLimitedSellers(assetId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://economy.roblox.com/v1/assets/" + assetId + "/resellers?cursor=&limit=10"}, 
			function(data) {
					resolve(data)
			})
	})
}

function reloadAvatar() {
	document.dispatchEvent(new CustomEvent('reloadAvatar'));
	loadCurrentlyWearing()
}

function unequipItem(assetId, assetTypeName) {
	document.dispatchEvent(new CustomEvent('unequipItem', {detail: {id: assetId}}))
	setTimeout(function() {
		loadCurrentlyWearing()
	}, 250)
}

function equipItem(assetId, assetTypeName) {
	document.dispatchEvent(new CustomEvent('equipItem', {detail: {id: assetId, assetTypeName: assetTypeName}}))
	setTimeout(function() {
		loadCurrentlyWearing()
	}, 250)
}

var inventory = []
var inventory_dict = {}
async function loadInventory(userId, cursor, type, retry, retryNum) {
	data = await fetchInventory(userId, cursor, type)
	if (retry == false) {
		for (i = 0; i < data.data.length; i++) {
			if (!(data.data[i].assetId in inventory_dict)) {
				inventory.push(data.data[i])
				inventory_dict[data.data[i].assetId] = data.data[i]
			}
		}
	}
	if (data.nextPageCursor != null) {
		await loadInventory(userId, data.nextPageCursor, type, false, 0)
	} else if (data.data.length == 100 && retryNum < 5) {
		await loadInventory(userId, cursor, type, true, retryNum + 1)
	}
}

function loadScrollImage(list) {
	for (i = 0; i < list.childNodes.length; i++) {
		elem = list.childNodes[i]
		if (elem.offsetTop < (list.clientHeight + list.scrollTop + 100)) {
			if (elem.style.display != "none" && elem.getElementsByTagName('img')[0].getAttribute('data-src') != "loaded" && elem.offsetTop >= list.scrollTop) {
				elem.getElementsByTagName('img')[0].src = elem.getElementsByTagName('img')[0].getAttribute('data-src')
				elem.getElementsByTagName('img')[0].setAttribute('data-src', 'loaded')
			}
		} else {
			break
		}
	}
}

function addQuickEquipItem(item) {
	li = document.createElement('li')
	li.setAttribute('style', 'height:80px;position:relative;')
	li.setAttribute('itemid', parseInt(item.assetId))
	li.setAttribute('class', 'qeitem')
	li.innerHTML = `<div class="section-content" style="padding:0px;width:529px;height:70px;position:absolute;left:5px;margin-bottom:10px;">
	<a target="_blank" href="https://www.roblox.com/catalog/${parseInt(item.assetId)}/Item">
		<img style="margin-left:10px;width:60px;float:left;" class="border-bottom" data-src="https://www.roblox.com/asset-thumbnail/image?assetId=${parseInt(item.assetId)}&amp;width=420&amp;height=420&amp;format=png" src=""></a><div class="border-bottom" style="position:absolute;right:5px;"><div style="float:right;"><a href="https://www.roblox.com/catalog/${parseInt(item.assetId)}/Item">
	</a>
<button type="button" class="btn-growth-lg add-quick-equip-item-button" itemassettypename="${stripTags(item.assetType)}" itemid="${parseInt(item.assetId)}" itemname="${stripTags(item.name)}" style="margin:5px;margin-left:10px;margin-top:15px;height:40px;width:40px;background-color:#0084DD;border:0px;font-size:30px;padding:5px;float:right;">+</button></div></div>
	<span style="" class="rbx-divider"></span>
<div style="white-space:nowrap;overflow:hidden;width:400px;position:absolute;padding:15px;top:8px;left:70px;" class="border-bottom">
<span>${stripTags(item.name)}</span>
	</div>
	</div>`
	li.getElementsByClassName('add-quick-equip-item-button')[0].addEventListener('click', function() {
		equipItem(parseInt(this.getAttribute('itemid')), this.getAttribute('itemassettypename'))
		document.getElementById('quickEquipModal').parentNode.remove()
	})
	document.getElementById('quickEquipInventoryList').appendChild(li)
}

function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
}

function fuzzyMatch(pattern, str) {
	pattern = '.*' + pattern.split('').join('.*') + '.*';
	const re = new RegExp(pattern);
	return re.test(str);
}

async function addQuickEquipModal() {
	quickEquipHTML = `<div id="quickEquipModal" class="upgrade-modal" style="z-index: 100000; display: block;">
	<div style="z-index:10000;display:block;overflow:hidden;" class="upgrade-modal">
		<div style="background-color:#232527;position:absolute;width:600px;height:575px;left:calc(50% - 300px);top:calc(50% - 300px);" class="dark-theme modal-content upgrade-modal-content">
			<span style="margin-top:5px;margin-right:5px;font-size:40px;" class="upgrade-modal-close">×</span>
			<h2 style="padding-bottom:5px;border-bottom: 3px solid #FFFFFF;font-family:HCo Gotham SSm;color:white;font-size:30px;position:absolute;top:25px;left:25px;width:550px;margin-top:10px;">
				<img style="width:119px;left:0px;margin-right:10px;margin-top:-20px;margin-left:35px;" src="https://ropro.io/images/ropro_logo.svg">
				<p style="color:white;display:inline-block;font-size:31px;font-weight:650;">Quick Equip Items</p>
			</h2>
			<span id="quickEquipLoading" style="margin:-7px;transform: scale(1.2); width: 100px; height: 25px; position:absolute;top:270px;left:250px;" class="spinner spinner-default"></span><div style="position:absolute;top:110px;width:550px;height:450px;left:25px;display:none;" id="inventoryDiv">
				<li class="panel-button" style="display: block;margin:10px;position:relative">
					<div style="margin-left:0px;height:30px;">
		<div id="filterSearchBar" style="overflow:visible;margin-top:-5px;margin-left:0px;float:left;width:530px;margin-left:0px;position:relative;" class="input-group-btn">
		<div class="input-group"><div><input id="filterSearch" class="form-control input-field new-input-field" placeholder="Inventory Search" maxlength="120" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value=""></div><div class="input-group-btn"><button style="margin-left:9px;" class="input-addon-btn"><span class="icon-common-search-sm"></span></button></div></div>
		<ul id="itemSearchList" style="position:absolute;top:38px;z-index:1000;"></ul>
		<ul id="itemSearchSelection" style="position:absolute;top:48px;width:100%;"></ul>
		</div>
		</div>
					
				</li>
				<ul class="inventoryList" style="width:560px;height:400px;overflow-y:auto;position:relative;margin-left:5px;" id="quickEquipInventoryList"></ul>
			</div>
		</div>
	</div>
	</div>`
	quickEquipDiv = document.createElement('div')
	quickEquipDiv.innerHTML = quickEquipHTML
	document.body.appendChild(quickEquipDiv)
	setTimeout(function() {
		document.getElementById('quickEquipModal').addEventListener('click', function(e) {
			if (document.getElementsByClassName('upgrade-modal-content').length > 0  && document.getElementById('secondaryModal') == null) {
				if (!document.getElementsByClassName('upgrade-modal-content')[0].contains(e.target)) {
					document.getElementById('quickEquipModal').parentNode.remove()
				}
			}
			if (document.getElementsByClassName('upgrade-modal-content-tertiary').length > 0 && document.getElementById('secondaryModal') == null) {
				if (!document.getElementsByClassName('upgrade-modal-content-tertiary')[0].contains(e.target)) {
					document.getElementById('quickEquipModal').parentNode.remove()
				}
			}
		})
	}, 500)
	document.getElementsByClassName('upgrade-modal-close')[0].addEventListener('click', function() {
		document.getElementById('quickEquipModal').parentNode.remove()
	})
	if (inventory.length == 0) {
		userID = parseInt(document.getElementsByName("user-data")[0].getAttribute("data-userid"))
		try {
			await loadInventory(userID, "", "hats gear", false, 0)
			await loadInventory(userID, "", "accessories", false, 0)
			await loadInventory(userID, "", "other", false, 0)
			await loadInventory(userID, "", "clothes", false, 0)
			await loadInventory(userID, "", "new clothes", false, 0)
		} catch {
			console.log("Inventory load error...")
		}
	}
	for (i = 0; i < inventory.length; i++) {
		addQuickEquipItem(inventory[i])
	}
	document.getElementById('quickEquipLoading').style.display = "none"
	document.getElementById('inventoryDiv').style.display = "block"
	loadScrollImage(document.getElementById('quickEquipInventoryList'))
	$("#quickEquipInventoryList").scroll(function() {
		loadScrollImage(this)
	})
	document.getElementById('filterSearch').focus()
	document.getElementById('filterSearch').addEventListener('input', function() {
		items = document.getElementsByClassName('qeitem')
		for(i = 0; i < items.length; i++) {
			id = parseInt(items[i].getAttribute('itemid'))
			if (inventory_dict[id].name.toLowerCase().includes(this.value.toLowerCase())) {
				items[i].style.display = "block"
			} else {
				items[i].style.display = "none"
			}
		}
		document.getElementById('quickEquipInventoryList').scrollTop = 0
		loadScrollImage(document.getElementById('quickEquipInventoryList'))
	})
}

function createUpgradeModal() {
    modalDiv = document.createElement('div')
    modalDiv.setAttribute('id', 'standardUpgradeModal')
    modalDiv.setAttribute('class', 'upgrade-modal')
    modalDiv.style.zIndex = 100000
    modalHTML = `<div id="standardUpgradeModal" style="z-index:10000;display:block;" class="upgrade-modal"><div style="background-color:#232527;position:absolute;width:500px;height:500px;left:-webkit-calc(50% - 250px);top:-webkit-calc(50% - 250px);" class="modal-content upgrade-modal-content">
    <span style="margin-top:5px;margin-right:5px;font-size:40px;" class="upgrade-modal-close">×</span>
    <h2 style="padding-bottom:5px;border-bottom: 3px solid #FFFFFF;font-family:HCo Gotham SSm;color:white;font-size:30px;position:absolute;top:20px;left:40px;"><img style="width:70px;left:0px;" src="https://ropro.io/images/standard_icon.png"> Standard Tier Feature</h2><div style="font-family:HCo Gotham SSm;color:white;font-size:16px;position:absolute;top:115px;left:200px;width:270px;">RoPro Outfit Randomizer is only available for<br><b><img style="width:20px;margin-top:-3px;margin-right:3px;" src="https://ropro.io/images/standard_icon.png">RoPro Standard Tier+</b><br>subscribers. This feature switches your avatar to a randomly chosen outfit you've made at a chosen time interval.</div><div style="font-family:HCo Gotham SSm;color:white;font-size:18px;position:absolute;top:270px;left:200px;width:270px;"><u>More Subscription Benefits:</u>
    <ul style="margin-left:20px;font-size:12px;font-family:HCo Gotham SSm;">
    <li style="list-style-type:circle;">Fastest Server &amp; Server Size Sort</li>
    <li style="list-style-type:circle;">More Game Filters &amp; Like Ratio Filter</li><li style="list-style-type:circle;">Trade Value &amp; Demand Calculator</li><li style="list-style-type:circle;">More Game Playtime Sorts</li><li style="list-style-type:circle;">And many more! Find a full list <a style="text-decoration:underline;cursor:pointer;" href="https://ropro.io#standard" target="_blank">here</a>.</li></ul>
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

async function addOutfitRandomizer() {
	div = document.createElement('div')
	outfitRandomizerButtonHTML = `<button id="outfitRandomizerButton" style="margin-right:150px;" ng-if="selectedMenu.name !== 'PresetCostumes'" ng-type="button" class="btn-secondary-xs btn-float-right ng-binding ng-scope" ng-click="createOutfitClicked()"> <img class="outfit-randomizer-icon" style="width:15px;margin-top:-12px;margin-bottom:-10px;margin-right:4px;" src="https://ropro.io/images/random_game.svg">Outfit Randomizer </button>`
	div.innerHTML = outfitRandomizerButtonHTML
	button = div.childNodes[0]
	document.getElementsByClassName('btn-secondary-xs btn-float-right ng-binding ng-scope')[0].parentNode.appendChild(button)
	button.addEventListener('click', function() {
		upgradeModal()
	})
}

async function addBackgrounds() {
	avatarBackgrounds = await fetchBackgrounds()
	for (i = 0; i < avatarBackgrounds.length; i++) {
		backgrounds.push(stripTags(avatarBackgrounds[i].split('.png')[0]))
	}
	loadBackgroundPage()
	document.getElementById('saveBackgroundButton').addEventListener('click', function() {
		setStorage("avatarBackground", stripTags(avatarBackground))
		savedAvatarBackground = stripTags(avatarBackground)
		this.style.display = "none"
	})
}

async function loadBackgroundPage() {
	if (typeof avatarBackground == 'undefined') {
		avatarBackground = "default"
	}
	$('.avatar-background-selector').remove()
	for (i = 0; i < 5; i++) {
		index = (backgroundsPage * 5) + i
		backgroundName = backgrounds[index]
		div = document.createElement('div')
		div.classList.add('avatar-background-selector')
		if (avatarBackground == backgroundName) {
			div.classList.add('selected')
		}
		div.setAttribute('style', `display:inline-block;height:63px;width:50px;overflow:hidden;margin-left:${i == 0 ? '2.5' : '5'}px;`)
		div.setAttribute('background-name', backgroundName.length >= 5 ? 'default' : backgroundName)
		imageSrc = backgroundName.length >= 5 ? 'https://images.rbxcdn.com/a9755c3db57524e4bae224d4e5e99ba7-avatar-upsell-background.svg' : 'https://ropro.io/avatar_backgrounds/' + backgroundName + '.png'
		div.innerHTML = `<img style="height:63px;" src="${imageSrc}">`
		document.getElementById('backgroundContainer').appendChild(div)
		div.addEventListener('click', function() {
			if (avatarBackground == this.getAttribute('background-name')) {
				setAvatarBackground("none")
				this.classList.remove("selected")
			} else {
				setAvatarBackground(stripTags(this.getAttribute('background-name')))
				$(".avatar-background-selector.selected").removeClass("selected")
				this.classList.add("selected")
			}
		})
	}
}

function setAvatarBackground(backgroundName) {
	if (backgroundName != savedAvatarBackground) {
		document.getElementById('saveBackgroundButton').style.display = 'inline-block'
	} else {
		document.getElementById('saveBackgroundButton').style.display = 'none'
	}
	avatarBackground = backgroundName.length >= 5 ? 'default' : backgroundName
	imageSrc = backgroundName.length >= 5 ? 'https://images.rbxcdn.com/a9755c3db57524e4bae224d4e5e99ba7-avatar-upsell-background.svg' : 'https://ropro.io/avatar_backgrounds/' + backgroundName + '.png'
	document.getElementsByClassName('avatar-back')[0].setAttribute('style', avatarBackground == 'default' ? '' : `background-image: url(${imageSrc});background-size:contain;`)
}

function updateCurrentlyWearing() {
	wearingContainer = document.getElementById('wearingContainer')
	wearingContainer.innerHTML = ""
	for (i = 0; i < wearing.length; i++) {
		item = parseInt(stripTags(wearing[i].toString()))
		div = document.createElement("div")
		div.innerHTML += `<div class="wearing-name input-group input-field"><a style="font-size:13px;font-weight:bold;" class="wearing-${item}" href="https://roblox.com/catalog/${item}/item">${stripTags(wearingInfoDict[item])}</a>
		<br><div id="outfitCostDiv" style="margin-top:-10px;display: inline-block;">
		<span style="margin-left:-5px;margin-right:-8px;margin-bottom:0px;transform: scale(0.4);" id="nav-robux" class="icon-robux-28x28 roblox-popover-close"></span>
		<span style="font-size:12px;" class="rbx-text-navbar-right text-header wearing-robux-${item}">${wearingCostDict[item] == null ? "Offsale" : addCommas(parseInt(wearingCostDict[item]))}</span></div>
		</div>
		<div style="display:inline-block;width:50px;height:50px;" class="thumbnail-2d-container wearing-card">
		<a><img itemid="${item}" class="item-card-thumb-container ${item}" style="width:100%;height:100%;" src="https://www.roblox.com/asset-thumbnail/image?assetId=${item}&width=420&height=420&format=png">
		</a></div>`
		div.setAttribute("class", "wearing-div")
		wearingContainer.appendChild(div)
		itemImage = div.getElementsByTagName("img")[0]
		function listen(itemImage) {
			itemImage.addEventListener("click", async function(){
				itemID = itemImage.getAttribute("itemid")
				unequipItem(parseInt(itemID))
				this.parentNode.parentNode.parentNode.remove()
			})
		}
		listen(itemImage)
	}
	div = document.createElement('div')
	div.innerHTML += `<div class="wearing-div"><div style="height:25px!important;margin-top:15px;z-index:1000;" class="wearing-name input-group input-field"><a style="font-size:13px;font-weight:bold;"><img src="https://ropro.io/images/ropro_logo_small.png" style="height:18px;margin-top:-2px;"> Quick Equip</a>
	<br>
	</div>
	<div style="display:inline-block;width:50px;height:50px;" class="thumbnail-2d-container wearing-card">
	<a><img class="item-card-thumb-container" style="width:100%;height:100%;filter:invert(0.7);" src="https://ropro.io/images/quick_add.png">
	</a></div></div>`
	div.setAttribute("class", "wearing-div")
	div.addEventListener('click', function() {
		addQuickEquipModal()
	})
	wearingContainer.appendChild(div)
}

var assetDetailsCache = {}
var limitedSellersCache = {}

async function calculateCost(assetId) {
	document.getElementById("outfitCostLoading").style.display = "inline-block"
	document.getElementById("outfitCostDiv").style.display = "none"
	if (assetId != -1) {
		if (assetId in assetDetailsCache) {
			assetDetails = assetDetailsCache[assetId]
		} else {
			assetDetailsCache[assetId] = await fetchAssetDetails(assetId)
			assetDetails = assetDetailsCache[assetId]
		}
		$(".wearing-" + assetId).html(stripTags(assetDetails.Name))
		wearingInfoDict[assetId] = stripTags(assetDetails.Name)
		if (assetDetails.IsLimited || assetDetails.IsLimitedUnique) {
			if (assetId in limitedSellersCache) {
				limitedSellers = limitedSellersCache[assetId]
			} else {
				limitedSellersCache[assetId] = await fetchLimitedSellers(assetId)
				limitedSellers = limitedSellersCache[assetId]
			}
			if (limitedSellers.data.length > 0) {
				wearingCostDict[assetId] = limitedSellers.data[0].price
				$(".wearing-robux-" + assetId).html(addCommas(limitedSellers.data[0].price))
			} else {
				wearingCostDict[assetId] = null
				$(".wearing-robux-" + assetId).html("Offsale")
			}
		} else {
			if (assetDetails.PriceInRobux != null) {
				wearingCostDict[assetId] = assetDetails.PriceInRobux
				$(".wearing-robux-" + assetId).html(addCommas(assetDetails.PriceInRobux))
			} else {
				wearingCostDict[assetId] = null
				$(".wearing-robux-" + assetId).html("Offsale")
			}
		}
	}
	cost = totalOutfitCost()
	if (cost[1] == 0) {
		costString = addCommas(parseInt(cost[0]))
	} else {
		costString = addCommas(parseInt(cost[0])) + "<b style='font-size:10px;'> + " + parseInt(cost[1]) + " offsale</b>"
	}
	document.getElementById("outfitCostRobux").innerHTML = costString
	document.getElementById("outfitCostLoading").style.display = "none"
	document.getElementById("outfitCostDiv").style.display = "inline-block"
	updateCurrentlyWearing()
}

async function loadCurrentlyWearing() {
	userID = parseInt(document.getElementsByName("user-data")[0].getAttribute("data-userid"))
	currentlyWearing = await fetchCurrentlyWearing(userID)
	wearing = []
	assets = currentlyWearing.assets
	for (i1 = 0; i1 < assets.length; i1++) {
		asset = assets[i1]
		if (!asset.assetType.name.includes("Animation") && !(asset.id in wearing)) {
			wearing.push(asset.id)
			calculateCost(asset.id)
		}
	}
}

async function mainAvatar() {
	avatarBox = $("[avatar-back]")
	if (avatarBox.length > 0) {
		div = document.createElement('div')
		div.innerHTML = wearingHTML
		insertAfter(div.childNodes[0], avatarBox.get(0))
		document.getElementById('refreshAvatar').addEventListener('click', function() {
			reloadAvatar()
		})
		loadCurrentlyWearing()
		backgroundDiv = document.createElement('div')
		backgroundDiv.innerHTML = backgroundContainerHTML
		document.getElementById('wearing').appendChild(backgroundDiv)
		document.getElementsByClassName('content')[0].setAttribute('style', "margin-bottom:400px;")
		document.getElementsByClassName('backgrounds-scroll-right')[0].addEventListener('click', function() {
			if (backgroundsPage * 5 < backgrounds.length - 5) {
				backgroundsPage++
				loadBackgroundPage()
				if (backgroundsPage * 5 >= backgrounds.length - 5) {
					this.classList.add('disabled')
				}
				document.getElementsByClassName('backgrounds-scroll-left')[0].classList.remove('disabled')
			}
		})
		document.getElementsByClassName('backgrounds-scroll-left')[0].addEventListener('click', function() {
			if (backgroundsPage > 0) {
				backgroundsPage--
				loadBackgroundPage()
				if (backgroundsPage == 0) {
					this.classList.add('disabled')
				}
				document.getElementsByClassName('backgrounds-scroll-right')[0].classList.remove('disabled')
			}
		})
		savedAvatarBackground = await getStorage("avatarBackground")
		avatarBackground = savedAvatarBackground
		addBackgrounds()
		if (avatarBackground != "default" || typeof avatarBackground != "undefined") {
			setAvatarBackground(avatarBackground)
		}
		//addOutfitRandomizer()
	} else {
		setTimeout(function() {
			mainAvatar()
		}, 100)
	}
}

mainAvatar()

window.addEventListener('load', (event) => {
	//loadCurrentlyWearing()
});

thumbnailExists = 0
setInterval(function() {
	if ($('#UserAvatar thumbnail-2d').length != thumbnailExists) {
		thumbnailExists = $('#UserAvatar thumbnail-2d').length
		if (thumbnailExists == 1 || thumbnailExists == 0) {
			setTimeout(function() {
				loadCurrentlyWearing()
			}, 100)
		}
	}
}, 10)
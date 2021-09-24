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


function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
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

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
 }

async function quicksearchMain() {
	if (document.getElementById('navbar-universal-search') != null) {
		dropdown = document.getElementById('navbar-universal-search').getElementsByClassName('dropdown-menu')[0]
		listItem = document.createElement('li')
		listItem.setAttribute("class", "navbar-search-option rbx-clickable-li")
		searchHTML = '<a id="userSearch" class="new-navbar-search-anchor" href=""><span class="icon-menu-profile navbar-list-option-icon"></span><span class="navbar-list-option-text"></span><span class="navbar-list-option-suffix">with <img style="width:20px;" src="https://ropro.io/images/standard_icon.png"> User Search.</span></a>'
		listItem.innerHTML += searchHTML
		userSearchAdded = false
		if (await fetchSetting("quickUserSearch")) {
			userSearchAdded = true
			insertAfter(listItem, dropdown.childNodes[dropdown.childNodes.length - 1])
		}
		listItem = document.createElement('li')
		listItem.setAttribute("class", "navbar-search-option rbx-clickable-li")
		searchHTML = '<a id="itemSearch" class="new-navbar-search-anchor" href=""><span class="icon-menu-shop navbar-list-option-icon"></span><span class="navbar-list-option-text"></span><span class="navbar-list-option-suffix">with <img style="width:20px;" src="https://ropro.io/images/pro_icon.png"> Item Search.</span></a>'
		listItem.innerHTML += searchHTML
		itemSearchAdded = false
		if (await fetchSetting("quickItemSearch")) {
			itemSearchAdded = true
			if (userSearchAdded) {
				dropdown = document.getElementById('navbar-universal-search').getElementsByClassName('dropdown-menu')[0]
				insertAfter(listItem, dropdown.childNodes[dropdown.childNodes.length - 1])
			} else {
				dropdown = document.getElementById('navbar-universal-search').getElementsByClassName('dropdown-menu')[0]
				insertAfter(listItem, dropdown.childNodes[dropdown.childNodes.length - 1])
			}
		}
		itemSearch = document.getElementById('itemSearch')
		$("#navbar-search-input").on('input', function(){
			console.log($("#navbar-search-input").val())
			query = stripTags($("#navbar-search-input").val())
			if (userSearchAdded) {
				userSearch.getElementsByClassName('navbar-list-option-text')[0].innerHTML = stripTags(query)
				userSearch.setAttribute("href", "https://ropro.io/userSearch.php?q=" + query)
			}
			if (itemSearchAdded) {
				itemSearch.getElementsByClassName('navbar-list-option-text')[0].innerHTML = stripTags(query)
				itemSearch.setAttribute("href", "https://ropro.io/itemSearch.php?q=" + query)
			}
		})
	}
}

quicksearchMain()
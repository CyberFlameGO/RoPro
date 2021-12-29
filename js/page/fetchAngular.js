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

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
 }

function formatTime(timeDifference) {
	timeSince = Math.round(timeDifference) / 1000
	if (timeSince < 60) { //seconds
		period = Math.round(timeSince)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} second${suffix}`
	} else if (timeSince / 60 < 60) { //minutes
		period = Math.round(timeSince / 60)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} minute${suffix}`
	} else if (timeSince / 60 / 60 < 24) { //hours
		period = Math.round(timeSince / 60 / 60)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} hour${suffix}`
	} else if (timeSince / 60 / 60 / 24 < 30) { //days
		period = Math.round(timeSince / 60 / 60 / 24)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} day${suffix}`
	} else if (timeSince / 60 / 60 / 24 / 30 < 12) { //months
		period = Math.round(timeSince / 60 / 60 / 24 / 30)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} month${suffix}`
	} else { //years
		period = Math.round(timeSince / 60 / 60 / 24 / 30 / 12)
		suffix = period == 1 ? "" : "s"
		timeString = `${period} year${suffix}`
	}
	return timeString
}

document.addEventListener('fetchTradeRows', function(event) {
	elements = $(".trade-row:not(.trade-id)")
	for (i = 0; i < elements.size(); i++) {
		tradeRow = elements.get(i)
		tradeInfo = angular.element(tradeRow).scope().trade
		tradeId = tradeInfo.id
		tradeRow.setAttribute('tradeid', parseInt(tradeId))
		tradeRow.setAttribute('username', stripTags(tradeInfo.user.name))
		tradeRow.classList.add('trade-id')
		tradeRow.classList.add(tradeId)
		if (event.detail.tradeTimeDisplay) {
			timeDifference = new Date().getTime() - new Date(tradeInfo.created).getTime()
			tradeRow.getElementsByClassName('trade-sent-date')[0].setAttribute("title", stripTags(tradeRow.getElementsByClassName('trade-sent-date')[0].innerText))
			tradeRow.getElementsByClassName('trade-sent-date')[0].innerText = formatTime(timeDifference)
		}
	}
})

document.addEventListener('replaceRows', function(event) {
	scrollContent = $('#trade-row-scroll-container').get(0).getElementsByClassName('simplebar-content')[0]
	document.getElementById('tab-Inbound').click()
	tradesDiv = document.getElementById('filteredTrades')
	if (tradesDiv != null) {
		trades = JSON.parse(decodeURI(tradesDiv.innerText))
		angular.element(scrollContent).scope().data.trades = trades
		angular.element(scrollContent).scope().selectTrade(angular.element(scrollContent).scope().data.trades[0])
		setTimeout(function() {
			angular.element(scrollContent).scope().data.trades.push(trades[trades.length - 1])
		}, 1000)
	}
})
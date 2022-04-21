/**

RoPro (https://ropro.io) v1.3

RoPro was wholly designed and coded by:
                               
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

document.addEventListener('fetchStatus', function(event) { //Adds status back to profile page
	document.getElementById("user-stat").removeAttribute("data-userstatus-disabled")
    angular.element(document.getElementsByClassName('header-caption')[0].children[1]).scope().isUserStatusDisabled()
    angular.element(document.getElementsByClassName('header-caption')[0].children[1]).scope().blurStatusForm()
})
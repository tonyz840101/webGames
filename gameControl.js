const games = ['Gobang', 'Shooting'/*, 'Lumines'*/]
const canvas = document.getElementById("gameDisplay")
const ctx = canvas.getContext("2d")
const FPS = 100
const colorBlue = '#4267b2'//'#1e90ff';
const colorRed = '#e3403a'

let gameOBJ = {
	'Gobang': new gobang(),
	'Shooting': new shooting(),
	/*'Lumines': false*/
}
let currentGame = false
let resizeMethod = false
let mousePosition = {x: 0, y: 0}
/*gameOBJ should have
init()
resize()
render()
mouseClick()
*/

if (window.addEventListener) {
	window.addEventListener("keyup", keyUp)
	window.addEventListener("keydown", keyDown)
} else if (window.attachEvent) {
	document.attachEvent("onkeyup", keyUp)
	document.attachEvent("onkeydown", keyDown)
} else {
	window.onkeyup = keyUp
	window.onkeydown = keyDown
}

function getMousePosition(e){
	let rect = canvas.getBoundingClientRect()
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	}
}

canvas.addEventListener('click', (e) => {
	currentGame.mouseClick(mousePosition)
	render()
})

canvas.addEventListener('mousemove', (e) => {
	mousePosition = getMousePosition(e)
})


function keyDown(e){
	e = e || window.event
	currentGame.keyDown(e)
}

function keyUp(e){
	e = e || window.event
	switch(e.keyCode){
		case 80: //P pause
			if(currentGame){
				currentGame.pause = !currentGame.pause
			}
			break
		default:
			currentGame.keyUp(e)
			break
	}
}

function defaultResizeCanvas() {
	let windowWidth = $(window).width(), windowHeight = $(window).height()
	let edge = Math.min( windowWidth-170, windowHeight-20 )
	if(windowWidth > 640)
		$('#gameDisplay').attr("width", edge).attr("height", edge)
	else
		$('#gameDisplay').attr("width", 640).attr("height", 640)
}

function pageInit(){
	let len = games.length
	
	for(let i = 0; i < len; i ++){
		let indexStr = 'game'+((i < 10)? '0'+i : ''+i)
		$('#buttonArea').append('<button class="midBTN" id="'+indexStr+'">'+games[i]+'</button>')
		$('#'+indexStr+'').click(() => {
			$("#right").show()
			$("#gameMessage").hide()
			buttonsToLeft()
			if(!gameOBJ[games[i]].state){
				gameOBJ[games[i]].init()
			} else {
				gameOBJ[games[i]].back()
			}
			for(let j = 0; j < len; j ++){//pause other game
				if(j != i) gameOBJ[games[i]].pause = true
				else gameOBJ[games[i]].pause = false
			}
			currentGame = gameOBJ[games[i]]
			resizeMethod = gameOBJ[games[i]].resize
			$('#'+indexStr+'').blur()
		})
	}
	resizeMethod = defaultResizeCanvas
	resizeMethod()
	$("#right").hide()
	$("#gameMessage").hide()
}

pageInit()

function gameMessageSet(text, color, btnTextArray, btnFunctionArray){//send in text and onclick function
	$("#gameMessageText").text(text).css('color', color)
	for(let i = 0; i < 3; i ++) $('#gameMessageBtn'+(i+1)+'').hide()
	for(let i = 0; i < btnTextArray.length; i ++){
		if(btnTextArray[i]){
			$('#gameMessageBtn'+(i+1)+'').text(btnTextArray[i])
			$('#gameMessageBtn'+(i+1)+'').off("click")
			$('#gameMessageBtn'+(i+1)+'').click(btnFunctionArray[i])
			$('#gameMessageBtn'+(i+1)+'').show()
		}
	}
	$("#gameMessage").css('height', 20+60*(btnTextArray.length+1))
	$("#gameMessage").show()
}

function buttonsToLeft(){
	if($('.atMid').length){
		$('.atMid').addClass('atLeft').removeClass('atMid')
	}/* else {
		$('.atLeft').addClass('atMid').removeClass('atLeft')
	}*/
	if($('.midBTN').length){
		$('.midBTN').addClass('leftBTN').removeClass('midBTN')
	}/* else {
		$('.leftBTN').addClass('midBTN').removeClass('leftBTN')
	}*/
	if($('.leftBTNArea').length) $('.midBTNArea').addClass('leftBTNArea').removeClass('midBTNArea')
	//else $('#buttonArea').addClass('midBTNArea').removeClass('leftBTNArea')
}

function drawCircle(x, y, r, deg1, deg2){
	ctx.moveTo(x+r, y)
	ctx.arc(x, y, r, deg1, deg2)
}

function render(){
	if(currentGame) currentGame.render()
}

$(window).resize(function(){
	resizeMethod()
	render()
})


setInterval(() => {
	render()
}, (1000 / FPS))

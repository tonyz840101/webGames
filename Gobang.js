function gobang(){
	this.gameState = {
		'init': 0,
		'chooseSide': 1,
		'playing': 2,
		'result': 3
	}
	this.state = this.gameState.init
	this.edge = 640
	this.unit = 40
	this.pause = false
	this.x_ind = 0
	this.y_ind = 0
	this.board = new Array(15)
	this.playerColor = 0
	this.botColor = 1
	this.moveRecord = []//record every step
	this.round = {'total': 0, 'win': 0}
	
	this.init = () => {
		console.log('gobang initiated')
		$('canvas').removeClass().addClass('Gobang')
		this.resize()
		this.render()
		this.state = this.gameState.chooseSide
		this.moveRecord = []
		let tmp = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		for(let i = 0; i < 15; i ++){
			this.board[i] = tmp.slice()
		}
		this.getPlayerColor()
	}
	
	this.keyUp = () => {return}
	this.keyDown= () => {return}
	
	this.back = () => {
		if(this.state == this.gameState.chooseSide) this.getPlayerColor()
		$('canvas').removeClass().addClass('Gobang')
		this.resize()
		this.render()
	}
	
	this.resize = () => {//needed
		let windowWidth = $(window).width()
		let windowHeight = $(window).height()
		this.edge = Math.min( windowWidth-170, windowHeight )
		this.unit = ~~(this.edge/16)-1
		if(this.unit < 40) this.unit = 40
		this.edge = this.unit * 16
		if(this.edge > 640){
			$('#gameDisplay').attr("width", this.edge)
			$('#gameDisplay').attr("height", this.edge)
			//console.log(this.edge)
			
		} else{
			$('#gameDisplay').attr("width", 640)
			$('#gameDisplay').attr("height", 640)
			//console.log(640)
		}
	}
	
	this.mouseClick = (mousePosition) => {
		if(this.state != this.gameState.playing) return//not in the state
		if((this.moveRecord.length + this.playerColor) % 2) return//not player's turn
		//console.log(mousePosition)
		//console.log(this.x_ind+' '+this.y_ind)
		this.move(this.x_ind, this.y_ind)
	}
	
	this.place = (x, y, color) => {
		this.board[y][x] = color
		this.moveRecord.push({'x': x, 'y':y, 'color': color})
		let result = this.checkResult(x, y)
		if(result !== false){
			this.round.total ++
			//console.log(result+' wins')
			this.state = this.gameState.result
			let msg = ''
			if(result == this.playerColor){
				this.round.win ++
				msg = 'You Win!'
				gameMessageSet(msg, colorBlue, [], [])
			} else {
				msg = 'You Lose!'
				gameMessageSet(msg, colorRed, [], [])
			}
			setTimeout(() => { gameMessageSet('New Game?', colorRed, ['Yes'], [() => {this.init()}]) }, 1000)
		}
	}
	
	this.move = (x, y) => {
		if(this.board[y][x] != -1){
			return
		} else {
			this.place(x, y, this.playerColor)
			setTimeout(() => {this.botMove(this.botColor)}, 750)
		}
	}
	
	this.botMove = (color) => {
		console.log('botMove')
		if(this.state != this.gameState.playing) return
		let x = 0
		let y = 0
		let move = false
		if(!this.moveRecord.length){
			this.place(7, 7, color)
			return
		}
		/*if(this.moveRecord.length == 1){//just for test SHOULD BE A calculated result 
			if(~~(Math.random()*2)) this.place(6, 7, this.botColor)
			else this.place(6, 6, this.botColor)
			return
		}*/
		move = analyze(this.board, color)
		//scoreWholeBoard(this.board, this.botColor)
		this.place(move.x, move.y, color)
	}
	
	this.getPlayerColor = () => {
		console.log('getPlayerColor')
		btnText = ['● black', '○ white']
		btnFunction = [
			(() => {
				this.setPlayerColor(0)
				$("#gameMessage").hide()
			}),
			(() => {
				this.setPlayerColor(1)
				$("#gameMessage").hide()
			})
		]
		gameMessageSet("choose your color", "#000", btnText, btnFunction)
		//gameMessageSet("choose your color", [], [])//test
	}
	
	this.setPlayerColor = (color) => {
		console.log('setPlayerColor')
		this.playerColor = color
		this.botColor = (color + 1) % 2
		this.state = this.gameState.playing
		if(color){
			console.log('Color = '+color)
			this.botMove(this.botColor)
		}
	}
	
	this.drawBoard = () => {
		ctx.fillStyle = "#000000"
		ctx.strokeStyle = "#000000"
		ctx.lineWidth = 1
		ctx.beginPath()
		let y = this.unit - ~~(this.unit / 4)
		for(let i = 0; i < 15; i ++){
			ctx.moveTo(this.unit, this.unit * (i + 1))
			ctx.lineTo(this.unit * 15, this.unit * (i + 1))
			ctx.stroke()
		}
		for(let i = 0; i < 15; i ++){
			ctx.moveTo(this.unit * (i + 1), this.unit)
			ctx.lineTo(this.unit * (i + 1), this.unit * 15)
			ctx.stroke()
		}
		let r = ~~(this.unit / 10);
		if(r < 3) r = 3
		drawCircle(this.unit * 4, this.unit * 4, r, 0, 2*Math.PI)
		drawCircle(this.unit * 12, this.unit * 4, r, 0, 2*Math.PI)
		drawCircle(this.unit * 4, this.unit * 12, r, 0, 2*Math.PI)
		drawCircle(this.unit * 12, this.unit * 12, r, 0, 2*Math.PI)
		drawCircle(this.unit * 8, this.unit * 8, r, 0, 2*Math.PI)
		ctx.fill()
		ctx.closePath()
		ctx.font = ~~(this.unit * 0.5) + "px Microsoft JhengHei"
		ctx.fillText('Win: '+this.round.win+' out of '+this.round.total+' games', this.unit * 1, y)
	}
	
	this.drawChess = () => {
		let r = (this.unit > 20)? (this.unit * 8 / 20) : this.unit / 2
		for(let y = 0; y < 15; y ++){
			for(let x = 0; x < 15; x ++){
				if(this.board[y][x] != -1){
					let w = 1
					ctx.beginPath()
					ctx.lineWidth = w
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
					if(!(this.board[y][x])){
						ctx.fillStyle = "#000"
					} else {
						ctx.fillStyle = "#fff"
						//ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
					}
					drawCircle(this.unit * (x+1), this.unit * (y+1), r, 0, 2*Math.PI)
					ctx.fill()
					drawCircle(this.unit * (x+1), this.unit * (y+1), (r-w), 0, 2*Math.PI)
					ctx.stroke()
					ctx.closePath()
				}
			}
		}
	}
	
	this.indexParse = () => {//mousePosition transform into index while mousePosition is in legal area
		if(mousePosition.x < this.unit / 2 || mousePosition.x > (this.unit * 31 / 2) || mousePosition.y < this.unit / 2 || mousePosition.y > (this.unit * 31 / 2) ){
			this.x_ind = -1
			this.y_ind = -1
		} else {
			this.x_ind = ~~((mousePosition.x - this.unit / 2) / this.unit)
			this.y_ind = ~~((mousePosition.y - this.unit / 2) / this.unit)
		}
	}
	
	this.drawLastMove = () => {
		if(!this.moveRecord.length) return
		let r = (this.unit > 20)? (this.unit * 8 / 20) : this.unit / 2
		r *= 0.35
		let x = this.moveRecord[this.moveRecord.length - 1].x
		let y = this.moveRecord[this.moveRecord.length - 1].y
		ctx.beginPath()
		ctx.fillStyle = colorBlue
		drawCircle((x + 1) * this.unit, (y + 1) * this.unit, r, 0, 2*Math.PI)
		ctx.fill()
		ctx.closePath()
	}
	
	this.drawFocus = () => {
		if(this.state != this.gameState.playing) return//not in the state
		if((this.moveRecord.length + this.playerColor) % 2) return//not player's turn
		this.indexParse()
		let r = (this.unit > 20)? (this.unit * 8 / 20) : this.unit / 2
		if(this.x_ind == -1 || this.y_ind == -1) return
		let midX = (this.x_ind + 1) * this.unit
		let midY = (this.y_ind + 1) * this.unit
		let tempColor1, tempColor2
		switch(this.playerColor){
			case 0:{
				tempColor1 = "rgba(0, 0, 0, 0.5)"
				tempColor2 = "#000"
				break
			}
			case 1:{
				tempColor1 = "rgba(255, 255, 255, 0.5)"
				tempColor2 = "#fff"
				break
			}
		}
		ctx.beginPath()
		if(this.y_ind >= 0 && this.y_ind < 15 && this.x_ind >= 0 && this.x_ind < 15){
			if(this.board[this.y_ind][this.x_ind] != -1){
				ctx.lineWidth = 3
				ctx.strokeStyle = colorRed
				ctx.moveTo(midX-r/2, midY-r/2)
				ctx.lineTo(midX+r/2, midY+r/2)
				ctx.moveTo(midX-r/2, midY+r/2)
				ctx.lineTo(midX+r/2, midY-r/2)
				ctx.stroke()
			} else {
				ctx.lineWidth = 1
				ctx.fillStyle = tempColor1
				drawCircle(midX, midY, r, 0, 2*Math.PI)
				ctx.fill()
				ctx.strokeStyle = tempColor2
				ctx.stroke()
			}
		}
		ctx.closePath()
	}
	
	this.render = () => {//needed
		if(this.state == this.gameState.init) return
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		this.drawBoard()
		this.drawChess()
		this.drawFocus()
		this.drawLastMove()
		//drawScore(this.unit)
	}
	
	this.checkResult = (x, y) => {
		let target = this.board[y][x]
		let fiveCounter = 0
		
		//dir +-X
		for(let i = 1; i < 6; i ++){
			if(x + i < 15){
				if(this.board[y][x + i] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		for(let i = 1; i < 6; i ++){
			if(x - i >= 0){
				if(this.board[y][x - i] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		//console.log((result_1 + result_2));
		if(fiveCounter == 4){
			return target
		}
		fiveCounter = 0
		//dir +-Y
		for(let i = 1; i < 6; i ++){
			if(y + i < 15){
				if(this.board[y + i][x] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		for(let i = 1; i < 6; i ++){
			if(y - i >= 0){
				if(this.board[y - i][x] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		//console.log((result_1 + result_2));
		if(fiveCounter == 4){
			return target
		}
		fiveCounter = 0
		//dir +Y+X
		for(let i = 1; i < 6; i ++){
			if(x + i < 15 && y + i < 15){
				if(this.board[y + i][x + i] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		for(let i = 1; i < 6; i ++){
			if(x - i >= 0 && y - i >= 0){
				if(this.board[y - i][x - i] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		//console.log((result_1 + result_2));
		if(fiveCounter == 4){
			return target
		}
		fiveCounter = 0
		//dir +Y-X
		for(let i = 1; i < 6; i ++){
			if(x - i >= 0 && y + i < 15){
				if(this.board[y + i][x - i] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		for(let i = 1; i < 6; i ++){
			if(x + i < 15 && y - i >= 0){
				if(this.board[y - i][x + i] == target){
					fiveCounter ++
				}
				else break
			}
			else break
		}
		//console.log((result_1 + result_2));
		if(fiveCounter == 4){
			return target
		}
		else return false
	}
}
//落子後會形成...
const Two1=['vssvv', 'vvssv']//point 10
const Two2=['vsvsv']//point 8
const Three1 = ['vsssvv', 'vvsssv', 'vssvsv', 'vsvssv']//活三 point 600
const Three2 = ['vsssvo', 'ovsssv']//弱活三 point 350
const Three3 = ['osssvv', 'vvssso', 'vssvso', 'ossvsv', 'vsvsso', 'osvssv', 'svsvs']//死三 point 300
const Four1 = ['vssssv']//活四 point 2000
const Four2 = ['ossssv', 'vsssso', 'sssvs', 'ssvss', 'svsss', 'ssssv', 'vssss', 'svssssv', 'vssssvs']//死四 point 1000
const Five = ['sssss']//point 10000
const chessPool = [Five, Four1, Four2, Three1, Three2, Three3, Two1, Two2]
const poolLen = chessPool.length

//big b<=2a a>2z z<2x y x 4:3
var chessScore = [20000, 5000, 3000, 1500, 550, 300, 40, 30]		//[20000, 2300, 1200, 550, 350, 300, 40, 30]
var EchessScore = [[10000, 3500, 650, 450, 200, 160, 10, 5], [10000, 3700, 670, 470, 220, 180, 10, 5]]//attack defence
//ver2 score
/*
20000	5
////////////////
15000	4 without block
15000	4 & 4
15000	4 & 3
///////////
10000	double 3
////////////////here are the pattern to win, score by pattern
1800	4
1300	3-1
500		3-2
100		3-3
40		2-1
30		2-2
*/
//var ver2Score = [[50000,15000,10000,  1800,1300,500,100,40,30],[40000,12000,8000,  1200,800,100,80,20,15],[40000,12000,8000,  2000,1500,700,100,50,40]]//player attack defence

function drawScore(unit){
	if(!scoreBoard) return
	let space = unit / 4
	ctx.font = "15px Microsoft JhengHei"
	ctx.fillStyle = "#0f0"
	for(let i = 0; i < 15; i ++){
		for(let j = 0; j < 15; j ++){
			if(scoreBoard[i][j] != -1){
				ctx.fillText(scoreBoard[i][j].toString(), unit * (j+1) - space, unit * (i+1))
			}
		}
	}
	
}

function boardToString(board, x, y, color){
	let result = ['', '', '', '']
	let halfScanningArea = 5, scanningArea = 11
	let tmp1 = x - halfScanningArea
	let tmp2 = y - halfScanningArea
	
	for(let i = 0; i < scanningArea; i ++){//dir +Y+X
		if(tmp1 + i >= 0 && tmp1 + i < 15 && tmp2 + i >= 0 && tmp2 + i < 15){
			if(i == halfScanningArea) result[0] += 's'
			else if(board[tmp2 + i][tmp1 + i] == -1) result[0] += 'v'
			else if(board[tmp2 + i][tmp1 + i] == color) result[0] += 's'
			else result[0] += 'o'
		}
	}
	tmp2 = y + halfScanningArea
	for(let i = 0; i < scanningArea; i ++){//dir +Y-X
		if(tmp1 + i >= 0 && tmp1 + i < 15 && tmp2 - i >= 0 && tmp2 - i < 15){
			if(i == halfScanningArea) result[1] += 's'
			else if(board[tmp2 - i][tmp1 + i] == -1) result[1] += 'v'
			else if(board[tmp2 - i][tmp1 + i] == color) result[1] += 's'
			else result[1] += 'o'
		}
	}
	for(let i = 0; i < scanningArea; i ++){//X
		if(tmp1 + i >= 0 && tmp1 + i < 15){
			if(i == halfScanningArea) result[2] += 's'
			else if(board[y][tmp1 + i] == -1) result[2] += 'v'
			else if(board[y][tmp1 + i] == color) result[2] += 's'
			else result[2] += 'o'
		}
	}
	tmp2 = y - halfScanningArea
	for(let i = 0; i < scanningArea; i ++){//Y
		if(tmp2 + i >= 0 && tmp2 + i < 15){
			if(i == halfScanningArea) result[3] += 's'
			else if(board[tmp2 + i][x] == -1) result[3] += 'v'
			else if(board[tmp2 + i][x] == color) result[3] += 's'
			else result[3] += 'o'
		}
	}
	return result
}

function scoreSinglePlace(board, x, y, color){
	let sample = boardToString(board, x, y, color)
	let Esample = boardToString(board, x, y, (color+1)%2)
	let skip = false
	let result = 0
	//ver1
	
	for(let k = 0; k < 4; k ++){//direction first to find best pattern
		skip = false
		let score = 0
		for(let i = 0; i < poolLen && !skip; i ++){
			let len = chessPool[i].length
			for(let j = 0; j < len && !skip; j ++){
				let tmp = sample[k].indexOf(chessPool[i][j])
				let tmp2 = Esample[k].indexOf(chessPool[i][j])
				if(tmp != -1 || tmp2 != -1){
					//console.log('add '+ chessScore[i])
					//score += chessScore[i]
					if(tmp == -1) score += EchessScore[color][i]
					else if(tmp2 == -1) score += chessScore[i]
					else  score += EchessScore[color][i] + chessScore[i]
					if(i < 3) skip = true
					break
				}
			}
		}
		result += score
	}
	
	//ver2 no skip, record everything and ignore less significant after this
	/*
	let patternDetect = new Array(poolLen)
	let EpatternDetect = new Array(poolLen)
	for(let i = 0; i < poolLen; i ++){
		patternDetect[i] = 0
		EpatternDetect[i] = 0
	}
	for(let k = 0; k < 4; k ++){//direction first to find best pattern
		skip = false
		for(let i = 0; i < poolLen && !skip; i ++){
			let len = chessPool[i].length
			for(let j = 0; j < len && !skip; j ++){
				let tmp = sample[k].indexOf(chessPool[i][j])
				if(tmp != -1){
					patternDetect[i]++
					break
				}
			}
			for(let j = 0; j < len && !skip; j ++){
				let tmp = Esample[k].indexOf(chessPool[i][j])
				if(tmp != -1){
					EpatternDetect[i]++
					break
				}
			}
		}
	}
	console.log(patternDetect, EpatternDetect)
	let score1 = scoring(patternDetect, 0)
	let score2 = scoring(EpatternDetect, 1)
	if(score1 > 9000 && score2 > 7000) result = (score1 > score2)? score1 : score2
	else result = score1 + score2
	console.log(result)
	*/
	return result
}
//var ver2Score = [[20000,15000,10000,  1800,1300,500,100,40,30],[17000,12000,8000,  1200,800,100,80,20,15],[17000,12000,8000,  2000,1500,700,100,50,40]]//player attack defence
/*function scoring(input, index){
	//ver2Score[index]
	let score = 0
	if(input[0]) score += ver2Score[index][0]
	else if(input[1]) score += ver2Score[index][1]
	else if((input[2] && input[3]) || input[2] > 1) score += ver2Score[index][1]
	else if(input[3] > 1) score += ver2Score[index][2]
	for(let i = 0; i < 6; i ++){
		if(input[2+i]){
			score += input[2+i] * ver2Score[index][3+i]
		}
	}
	return score
}*/
/*
20000	5
////////////////
15000	4 without block
15000	4 & 4
15000	4 & 3
///////////
10000	double 3
////////////////here are the pattern to win, score by pattern
1800	4
1300	3-1
500		3-2
100		3-3
40		2-1
30		2-2
*/
var scoreBoard = false

function scoreWholeBoard(board, color){
	scoreBoard = new Array(15)
	let max = [{'x': -1,'y' : -1, 'val': -1}]
	for(let i = 0; i < 15; i ++){
		scoreBoard[i] = new Array(15)
		for(let j = 0; j < 15; j ++){
			if(board[i][j] == -1){
				scoreBoard[i][j] = scoreSinglePlace(board, j, i, color)
				if(scoreBoard[i][j] == max.val) max.push({'x': j,'y' : i, 'val': scoreBoard[i][j]})
				else max = (scoreBoard[i][j] > max[0].val)? [{'x': j,'y' : i, 'val': scoreBoard[i][j]}] : max
			}
			else{
				scoreBoard[i][j] = -1
			}
		}
	}
	//console.log(scoreBoard)
	console.log(max)
	if(max.length) return max[~~(Math.random() * max.length)]
	else{
		while(1){
			let a = ~~(Math.random() * 15)
			let b = ~~(Math.random() * 15)
			if(board[a][b] == -1) return {'x': b,'y' : a, 'val': 0}
		}
	}
}

function analyze(board, color){
	result = scoreWholeBoard(board, color)
	return result
}
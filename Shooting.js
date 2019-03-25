function shooting(){
	this.gameState = {
		'init': 0,
		'preStart': 1,
		'playing': 2,
		'result': 3
	}
	this.state = this.gameState.init
	this.pause = false
	this.displayScale = 1
	this.unit = 200
	this.renderScale = 1
	this.edge = 600
	this.speed = 240
	this.planeInfo = []
	this.bullet = [[],[]]
	this.fireLock = {'32': false, '82': false}
	this.counter = 0
	this.stars = []
	this.shoot = false
	//document.addEventListener("mousedown", () => {this.fire()}, false);
	
	

	this.keyDown = (e) => {
		switch(e.keyCode){
			case 32:{//space
				if(!this.pause && !this.fireLock[(e.keyCode.toString())]){
					this.shoot = true
				}
				break
			}
			case 82:{//R
				if(!this.pause && !this.fireLock[(e.keyCode.toString())]){
					this.fireLock[(e.keyCode.toString())] = true
					setTimeout(()=>{this.fireLock[(e.keyCode.toString())] = false}, 20000)
					let power = 66
					for(let i = 0; i < power; i ++){
						let x = Math.cos(i*(360/power))
						let y = Math.sin(i*(360/power))
						this.fire(this.planeInfo[0].x+x*12, this.planeInfo[0].y+y*12, {'x': x, 'y': y}, '#ff0', 0, 1, 0, 100)
					}
				}
				break
			}
		}
	}
	
	this.keyUp = (e) => {
		switch(e.keyCode){
			case 32:{//space
					this.shoot = false
				break
			}
		}
	}
	
	this.init = () => {
		console.log('shooting initiated')
		$('canvas').removeClass().addClass('Shooting')
		this.resize()
		this.render()
		this.planeInfo.push(new playerPlane(200, 593))//map to 400*600
		//this.planeInfo.push(new enemyPlane({'x': 200, 'y': 150, 'w': 10, 'unitVecor': {'x': 0.7, 'y': 0.7}, 'speed': 1, 'movement': [], 'sheld': 0, 'HP': 1, 'side': 1}, this.fire))
		//this.planeInfo.push(new enemyPlane({'x': 200, 'y': 150, 'w': 10, 'unitVecor': {'x': -0.7, 'y': 0.7}, 'speed': 1, 'movement': [], 'sheld': 0, 'HP': 1, 'side': 1}, this.fire))
		for(let i = 5; i < 599; i += 25){
			for(let j = 5; j < 399; j += 25){
				this.planeInfo.push(new enemyPlane({'x': j, 'y': i, 'w': 10, 'unitVecor': {'x': 0, 'y': 0}, 'speed': 1, 'movement': [], 'sheld': 0, 'HP': 5, 'side': 1}, this.fire))
			}
		}
		this.state = this.gameState.preStart
	}
	
	this.back = () => {
		//if(this.state == this.gameState.chooseSide) this.getPlayerColor()
		$('canvas').removeClass().addClass('Shooting')
		this.resize()
		this.render()
	}
	
	this.mousePositionToGrid = () => {
		return {'x': mousePosition.x / this.renderScale, 'y': mousePosition.y / this.renderScale}
	}
	
	this.playerShoot = () => {
		if(!this.shoot) return
		if(this.fireLock['32']) return
		this.fireLock['32'] = true
		setTimeout(()=>{this.fireLock['32'] = false}, 100)
		this.fire(this.planeInfo[0].x, this.planeInfo[0].y - this.planeInfo[0].w - 2, {'x': 0, 'y': -1}, '#fff', 0, 1, 0, 150)
	}
	
	this.fire = (x, y, unitVector, color, effect, injury, attackSide, speed) => {
		if(!this.planeInfo.length) return
		//console.log(this.planeInfo[0])
		let injureSide = (attackSide+1)%2
		this.bullet[injureSide].push({'x': x, 'y': y, 'unitVector': unitVector, 'speed': speed, 'size': 3, 'color': color, 'effect': effect, 'injury': injury})
		//console.log(this.bullet)
	}
	
	this.resize = () => {//needed
		let windowWidth = $(window).width()
		let windowHeight = $(window).height()
		this.edge = Math.min( (windowWidth-170)*3, windowHeight*2 )
		this.unit = ~~(this.edge/6)-1
		if(this.unit < 200) this.unit = 200
		this.renderScale = this.unit/200
		$('#gameDisplay').attr("width", this.unit*2)
		$('#gameDisplay').attr("height", this.unit*3)
		console.log(this.unit)
	}
	
	this.mouseClick = (mousePosition) => {
		return
	}
	
	this.moveBullet = () => {
		for(let i = 0; i < 2; i ++){
			let len = this.bullet[i].length
			let j = 0
			for(j = 0; j < len; j ++){
				let speed = this.bullet[i][j].speed / FPS
				this.bullet[i][j].x += this.bullet[i][j].unitVector.x * speed
				this.bullet[i][j].y += this.bullet[i][j].unitVector.y * speed
			}
			j = 0
			let removeList = []
			while(j < this.bullet[i].length){
				if(this.bullet[i][j].x > 400 || this.bullet[i][j].x < 0 || this.bullet[i][j].y > 600 || this.bullet[i][j].y < 0){
					removeList.push(j)
					this.bullet[i].splice(j, 1)
				} else {
					j ++
				}
			}
		}
	}
	
	this.drawGalaxy = () => {
		if(!this.stars.length){
			for(let i = 5; i < 599; i += 25){
				for(let j = 0;  j < 5; j ++){
					let s_x = Math.floor(Math.random() * 399)
					let change =(Math.floor(Math.random()*2))? 0.005: -0.005
					this.stars.push({'x': s_x, 'y': i, 'bright': Math.random()/2, 'shine': change})
				}
			}
		}
		else if(!(this.counter % 50)){
			for(let j = 0;  j < 5; j ++){
				let s_x = Math.floor(Math.random() * 399)
				let change =(Math.floor(Math.random()*2))? 0.005: -0.005
					this.stars.push({'x': s_x, 'y': j, 'bright': Math.random()/2, 'shine': change})
			}
		}
		for(let i = 0; i < this.stars.length; i ++){
			ctx.beginPath()
			ctx.fillStyle = "rgba(255,255,255,"+this.stars[i].bright+")";
			if(this.stars[i].bright + this.stars[i].shine > 0.7 || this.stars[i].bright + this.stars[i].shine < 0)
				this.stars[i].shine =- this.stars[i].shine * (60/FPS)
			this.stars[i].bright += this.stars[i].shine
			ctx.arc(this.renderScale * this.stars[i].x, this.renderScale * this.stars[i].y, 1, 0, 2*Math.PI)
			this.stars[i].y += 0.5
			ctx.fill()
			ctx.closePath()
			if(this.stars[i].y > 600) this.stars.splice(i--, 1)
		}
	}
	
	this.drawBullet = () => {
		//console.log(this.bullet)
		for(let i = 0; i < 2; i ++){
			let len = this.bullet[i].length
			//console.log(len)
			//console.log(this.bullet[i])
			for(let j = 0; j < len; j ++){
				//console.log(this.bullet[i][j])
				let x = this.bullet[i][j].x * this.renderScale
				let y = this.bullet[i][j].y * this.renderScale
				let vecX = this.bullet[i][j].unitVector.x * this.renderScale
				let vecY = this.bullet[i][j].unitVector.y * this.renderScale
				let size = this.bullet[i][j].size
				ctx.strokeStyle = this.bullet[i][j].color
				ctx.lineWidth = 2
				ctx.beginPath()
				ctx.moveTo(x, y)
				ctx.lineTo(x-vecX*size, y-vecY*size)
				ctx.stroke()
				ctx.closePath()
			}
		}
	}
	
	this.movePlane = () => {
		//console.log(info)
		
		this.planeInfo[0].move(this.mousePositionToGrid(), this.speed)
		let len = this.planeInfo.length
		for(let i = 1; i < len; i ++){
			this.planeInfo[i].move(this.counter)
		}
	}
	
	this.drawPlane = () => {
		//console.log(this.planeInfo)
		let len = this.planeInfo.length
		for(let i = 0; i < len; i ++){
			this.planeInfo[i].draw(this.renderScale)
		}
	}
	
	this.collisionDetection = () => {
		//bullet to plane
		for(let i = 0; i < this.planeInfo.length; i ++){
			let bullet = this.bullet[this.planeInfo[i].side]
			for(let j = 0; j < bullet.length; j ++){
				//console.log('check ' + i)
				let contact = this.planeInfo[i].collision([{'x': bullet[j].x, 'y': bullet[j].y}])
				//console.log(contact)
				if(contact){
					let explode = this.planeInfo[i].hurt(bullet[j].injury)
					bullet.splice(j, 1)
					j --
					if(explode){
						if(i){
						this.planeInfo.splice(i, 1)
						i --
						break
						} else {
							console.log('lose')
						}
					}
				}
			}
		}
		//plane to plane
		let player = this.planeInfo[0].getBody()
		for(let i = 1; i < this.planeInfo.length; i ++){
				this.planeInfo[i].testD = false
			let contact = this.planeInfo[i].collision(player)
			if(contact){
					this.planeInfo[i].testD = true
				let explode1 = this.planeInfo[i].hurt(1)
				let explode2 = this.planeInfo[0].hurt(1)
				if(explode1){
					//splice(i, 1)
					i --
					break
				} else if(explode2){
					console.log('lose')
				}
			}
		}
	}
	
	this.render = () => {//needed
		if(this.state == this.gameState.init || this.pause) return
		this.playerShoot()
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		this.drawGalaxy()
		this.drawPlane()
		this.drawBullet()
		this.movePlane()
		this.moveBullet()
		this.collisionDetection()
		/*for(let i = 0; i < 50; i ++)
			this.bullet[0].push({'x': 150+i*5, 'y': 5, 'unitVector': {'x': 0, 'y': 1}, 'speed': 1.5, 'size': 3, 'color': '#fff', 'effect': 0, 'injury': 2})*/
		//if(this.fireLock) this.fireLock --
		//console.log(this.counter)
		this.counter ++
	}
}

function playerPlane(x, y){
	this.x = x
	this.y = y
	this.w = 10
	this.side = 0
	//this.pattern = 0
	this.sheld = 0
	this.HP = 10
	/*
	x-w/2, y+w/2  //
	x+w/2, y+w/2  //
	x, y-w/2      //
	*/
	this.addSheld = (time) => {
		this.sheld = time*FPS
	}
	
	this.getBody = () => {
		return [
			{'x': this.x - this.w / 2, 'y': this.y + this.w / 2},
			{'x': this.x + this.w / 2, 'y': this.y + this.w / 2},
			{'x': this.x, 'y': this.y - this.w/2}
		]
	}
	
	this.hurt = (injury) => {
		this.HP -= injury
		//if(this.HP < 1) return true
		//else return false
		return false
		console.log('hurt '+injury)
	}
	
	this.drawSheld = (renderScale) => {
		let x = this.x * renderScale
		let y = this.y * renderScale
		let w = this.w * renderScale
		let shine = (this.sheld%200 > 99)? (199 - this.sheld%200) : (this.sheld%200)
		ctx.lineWidth = w/3
		ctx.strokeStyle = 'rgba(255, 255, 255, '+(0.2+0.6*shine/100)+')'
		ctx.beginPath()
		drawCircle(x, y, 2*w, 0, 2*Math.PI)
		ctx.stroke()
		ctx.closePath()
		this.sheld --
	}
	
	this.collision = (coordinates) => {
		let len = coordinates.length//point line triangle
		switch(len){
			case 1:{
				if(coordinates[0].y <= this.y + this.w/2 && coordinates[0].y >= this.y - this.w/2){
					if(coordinates[0].x <= this.x + this.w/2 && coordinates[0].x >= this.x - this.w/2){
						if(2*(coordinates[0].x - this.x) <= (coordinates[0].y - (this.y - this.w/2))){
							if(2*(coordinates[0].x - this.x) >= ((this.y - this.w/2) - coordinates[0].y)){
								return true
							}
						}
					}
				}
				return false
				break
			}
			case 2:{
				if(this.collision([coordinates[0]]) || this.collision([coordinates[1]])){
					//console.log(1)
					return true
				}
				let scale = 10
				let unitX = (coordinates[1].x - coordinates[0].x)/scale
				let unitY = (coordinates[1].y - coordinates[0].y)/scale
				for(let i = scale; i --; ){
					let samplePoint = {'x': coordinates[0].x + i * unitX, 'y': coordinates[0].y +  i * unitY}
					if(this.collision([samplePoint])){
						//console.log(2)
						return true
					}
				}
				break
			}
			case 3:{
				for(let i = 0; i < 3; i ++){
					if(this.collision([coordinates[i], coordinates[(i+1) % 3]])) return true
				}
				break
			}
		}
	}
	
	this.draw = (renderScale) => {
		let x = this.x * renderScale
		let y = this.y * renderScale
		let w = this.w * renderScale
		ctx.beginPath()
		ctx.strokeStyle = "#fff"
		ctx.lineWidth = 1
		ctx.moveTo(x, y + w/4)
		ctx.lineTo(x - w/2, y + w/2)
		ctx.lineTo(x, y - w/2)
		ctx.lineTo(x + w/2, y + w/2)
		ctx.lineTo(x, y + w/4)
		ctx.stroke()
		if(this.sheld) this.drawSheld(renderScale)
		ctx.closePath()
	}
	
	this.move = (mousePos, speed) => {
		/*40 20 0*/
		let disX = mousePos.x - this.x
		let disY = mousePos.y - this.y
		let distance = Math.sqrt(disX * disX + disY * disY)
		if(distance < 11) {
			speed = 35
		} else if(distance < 26) {
			speed = distance*1.2+ 40
		} else if(distance < 50) {
			speed = distance * 3 + 60
		}
		//console.log('moving with speed '+speed+' per frame')
		let speedScale = speed / FPS / distance
		disX *= speedScale
		disY *= speedScale
		if(this.x + disX < (400-this.w/2) && this.x + disX > this.w/2){
			this.x += disX
		}
		if(this.y + disY < (600-this.w/2) && this.y + disY > this.w/2){
			this.y += disY
		}
	}
}


function enemyPlane(info, fire){
	this.x = info.x
	this.y = info.y
	this.w = info.w
	this.side = info.side
	this.speed = info.speed
	this.sheld = info.sheld
	this.HP = info.HP
	this.unitVecor = info.unitVecor
	this.testD = false
	/*
	x-w/2, y+w/2  //
	x+w/2, y+w/2  //
	x, y-w/2      //
	*/
	
	this.getBody = () => {
		return [
			{'x': this.x - this.w / 2, 'y': this.y - this.w / 2},
			{'x': this.x + this.w / 2, 'y': this.y - this.w / 2},
			{'x': this.x, 'y': this.y + this.w/2}
		]
	}
	
	this.hurt = (injury) => {
		this.HP -= injury
		if(this.HP < 1) return true
		else return false
		//console.log('hurt '+injury)
	}
	
	this.collision = (coordinates) => {
		let len = coordinates.length//point line triangle
		switch(len){
			case 1:{
				if(coordinates[0].y <= this.y + this.w/2 && coordinates[0].y >= this.y - this.w/2){
					if(coordinates[0].x <= this.x + this.w/2 && coordinates[0].x >= this.x - this.w/2){
						if(2*(coordinates[0].x - this.x) >= (coordinates[0].y - (this.y + this.w/2))){
							if(2*(coordinates[0].x - this.x) <= ((this.y + this.w/2) - coordinates[0].y)){
								return true
							}
						}
					}
				}
				return false
				break
			}
			case 2:{
				if(this.collision([coordinates[0]]) || this.collision([coordinates[1]])){
					//console.log(1)
					return true
				}
				let scale = 10
				let unitX = (coordinates[1].x - coordinates[0].x)/scale
				let unitY = (coordinates[1].y - coordinates[0].y)/scale
				for(let i = scale; i --; ){
					let samplePoint = {'x': coordinates[0].x + i * unitX, 'y': coordinates[0].y +  i * unitY}
					if(this.collision([samplePoint])){
						//console.log(2)
						return true
					}
				}
				break
			}
			case 3:{
				//console.log(coordinates)
				for(let i = 0; i < 3; i ++){
					if(this.collision([coordinates[i], coordinates[(i+1) % 3]])) return true
				}
				break
			}
		}
	}
	
	this.draw = (renderScale) => {
		let x = this.x * renderScale
		let y = this.y * renderScale
		let w = this.w * renderScale
		ctx.beginPath()
		ctx.strokeStyle = "#f00"
		if(this.testD) ctx.strokeStyle = "#ff0"
		ctx.lineWidth = 1
		ctx.moveTo(x, y - w/4)
		ctx.lineTo(x - w/2, y - w/2)
		ctx.lineTo(x, y + w/2)
		ctx.lineTo(x + w/2, y - w/2)
		ctx.lineTo(x, y - w/4)
		ctx.stroke()
		ctx.closePath()
	}
	
	this.move = (counter) => {
		if(info.movement.length){
		} else {
			let x = this.x + this.speed * this.unitVecor.x
			let y = this.y + this.speed * this.unitVecor.y
			if(x >= (400 - this.w/2) || x <= this.w/2){
				this.unitVecor.x = -this.unitVecor.x
			}
			if(y >= (600 - this.w/2) || y <= this.w/2){
				this.unitVecor.y = -this.unitVecor.y
			}
			this.x += this.speed * this.unitVecor.x
			this.y += this.speed * this.unitVecor.y
		}
		if(!(counter % ~~(FPS/2))) fire(this.x, this.y + this.w + 2, {'x': 0, 'y': 1}, '#f00', 0, 1, this.side, 150)
	}
}
class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('wave', './assets/sprites/wave.png');
		this.load.image('spray', 'assets/particles/white.png');
	}

	create() {
		this.createWaves();
		this.createBarrel();
		this.createSpray();


	}


	update() {
		this.updateWaves();

	}

	createWaves() {
		gameState.waveConfig = {
			waveTime: 0,
			barrelSize: 750,
			waveHeight: 300,
			waveSpriteWidth: 250
		};
		gameState.wave = this.add.group();
		for (let i = 0; i < game.config.width; i+=gameState.waveConfig.waveSpriteWidth) {
			gameState.wave.create(i, gameState.waveConfig.waveHeight, 'wave').setOrigin(0, 0);
		}
		gameState.sprays = [];
	}

	createBarrel() {

		for (let i = 0; i < gameState.waveConfig.barrelSize; i+=gameState.waveConfig.waveSpriteWidth) {
			gameState.sprays.push(
				this.add.particles('spray').createEmitter({
					x: {min: i, max: i+gameState.waveConfig.waveSpriteWidth},
					y: 150,
					lifespan: 3000 - (i*4),
					speedX: { min:-850, max:0 },
					speedY: { min: -400, max: 400 },
					scale: { start: 1.7, end: 0 },
					quantity: 6,
					gravityY: 900,
					blendMode: 'ADD'
				}).reserve(1000)
			)
		}
	}

	createSpray() {
		for (let i = gameState.waveConfig.barrelSize; i < game.config.width; i+=gameState.waveConfig.waveSpriteWidth) {
			gameState.sprays.push(
				this.add.particles('spray').createEmitter({
					x: {min: i, max: i+gameState.waveConfig.waveSpriteWidth},
					y: 150,
					lifespan: 1000,
					speedX: { min:-850, max:0 },
					speedY: 0,
					scale: { start: 1, end: 0.8 },
					quantity: 1,
					gravityY: 0,
					blendMode: 'ADD'
				}).reserve(1000)
			)
		}
	}

	waveMovement(x) {
		x += gameState.waveConfig.waveTime;
		let y = Math.sin(x * 0.05) * 25;
		return y ;
	}

	updateWaves() {
		gameState.waveConfig.waveTime += 1;
	  // this.count increments every frame. gives us a constantly
	  // increasing X value for our sin function
	  var i = 0;
	  gameState.wave.getChildren().forEach((currentWave, i) => {
			currentWave.y = gameState.waveConfig.waveHeight + this.waveMovement(i*gameState.waveConfig.waveSpriteWidth);
	  });
		gameState.sprays.forEach((currentSpray, i) => {
	    currentSpray.setPosition(currentSpray.x.max, gameState.waveConfig.waveHeight + this.waveMovement(i*gameState.waveConfig.waveSpriteWidth));
		})
	}

}

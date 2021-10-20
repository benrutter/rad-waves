class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('wave', './assets/sprites/wave.png');
		this.load.image('spray', 'assets/particles/white.png');
		this.load.spritesheet('surfer', './assets/sprites/surfer.png', { frameWidth: 32, frameHeight: 32 });
	}

	create() {

		this.createWaves();

		this.physics.world.setBounds(0, 0, game.config.width*3, gameState.waveConfig.waveHeight + gameState.waveConfig.waveDepth + gameState.waveConfig.waveBottom);
		gameState.cursors = this.input.keyboard.createCursorKeys();

		this.movingWave();
		this.createSpray();
		this.createSurfer();
		this.createBarrel();

		this.cameras.main.startFollow(gameState.surfer, true, 0.5, 0.5);
		this.cameras.main.setBounds(0, 0, game.config.width*3, gameState.waveConfig.waveHeight + gameState.waveConfig.waveDepth + gameState.waveConfig.waveBottom);

		this.input.keyboard.on('keyup-A', () => {
			if (gameState.surfer.body.y > gameState.waveConfig.waveHeight
				& gameState.surfer.body.y < gameState.waveConfig.waveHeight + 200) {
					gameState.surfer.body.setVelocityY(gameState.surfer.body.velocity.y - 500);
				}
		});
		this.input.keyboard.on('keydown-S', () => {
			if (gameState.surfer.body.y > gameState.waveConfig.waveHeight - 30
				& gameState.surfer.body.y < gameState.waveConfig.waveHeight + 30) {
					gameState.floater = true;
					gameState.floaterCounter = 1;
				}
		});
		this.input.keyboard.on('keyup-S', () => {
					gameState.floater = false;
					gameState.floaterCounter = 0;
		});
	}


	update() {
		this.controlSurfer();
		// if player is too far back then 'wipeout!'
		if (gameState.surfer.body.x < gameState.waveConfig.barrelSize/3) {
			this.scene.restart();
		} else if (gameState.surfer.body.x > game.config.width*2) {
			this.scene.restart();
		} else if (gameState.surfer.body.x < gameState.waveConfig.barrelSize & gameState.surfer.body.y < gameState.waveConfig.waveHeight + 30) {
			console.log('yieks1');
			this.scene.restart();
		}
	}

	createWaves() {
		gameState.waveConfig = {
			waveTime: 0,
			barrelSize: 1050,
			waveHeight: 1300,
			waveDepth: 700,
			waveBottom: 100,
			waveSpriteWidth: 250,
		};
		gameState.wave = this.add.group();
		for (let i = 0; i < game.config.width*3; i+=gameState.waveConfig.waveSpriteWidth) {
			gameState.wave.create(i, gameState.waveConfig.waveHeight, 'wave').setOrigin(0, 0);
		}
		gameState.sprays = [];
	}

	createBarrel() {

		for (let i = 0; i < gameState.waveConfig.barrelSize; i+= 20) {
			gameState.sprays.push(
				this.add.particles('spray').createEmitter({
					x: {min: i, max: i+150},
					y: gameState.waveConfig.waveHeight,
					lifespan: 1500,
					speedX: { min:-850, max:0 },
					speedY: { min: -400, max: 1400 },
					scale: { start: 1.3, end: 0 },
					quantity: 0.00000001,
					gravityY: 900,
					blendMode: 'ADD'
				}).reserve(1000)
			)
		}
	}

	createSpray() {
		for (let i = gameState.waveConfig.barrelSize; i < game.config.width*3; i+=10) {
			gameState.sprays.push(
				this.add.particles('spray').createEmitter({
					x: {min: i, max: i+10},
					y: gameState.waveConfig.waveHeight,
					lifespan: 25,
					speedX: { min:-850, max:0 },
					speedY: { min:-400, max:400 },
					scale: { start: Math.max(((game.config.width - i)/game.config.width) * 5, 0.5), end: 0.4 },
					quantity: 0.5,
					gravityY: 900,
					blendMode: 'ADD'
				}).reserve(1000)
			)
		}
	}

	movingWave() {
		this.add.particles('spray').createEmitter({
			x: game.config.width * 3.2,
			y: {min: gameState.waveConfig.waveHeight, max: gameState.waveConfig.waveHeight + gameState.waveConfig.waveDepth},
			lifespan: 2500,
			speedX: -2000,
			speedY: 0,
			scale: 0.03,
			gravityY: 0,
			blendMode: 'ADD',
		})

	}

	createSurfer() {
		gameState.surfer = this.physics.add.sprite(gameState.waveConfig.barrelSize + 100, gameState.waveConfig.waveHeight + gameState.waveConfig.waveDepth/2, 'surfer').setScale(3).setCollideWorldBounds(true);
		gameState.spin = 0;
		gameState.spinning = 0;
		gameState.floater = false;
		for (let i = 1; i < 17; i++) {
			this.anims.create({
	      key: i,
	      frames: this.anims.generateFrameNumbers('surfer', { start: i-1, end: i-1 }),
	      frameRate: 5,
	      repeat: -1,
	    });
		}

	}

	controlSurfer() {
		let frame = Math.floor(gameState.spin / 360 * 16) + 1;
		gameState.surfer.anims.play(frame, true);
		let maxSpin = 10;

		// controlling spin
		gameState.spinning *= 0.98;
		if (gameState.cursors.left.isDown) {
			gameState.spinning += 0.2;
			gameState.spinning = Math.min(gameState.spinning, maxSpin);
		} if (gameState.cursors.right.isDown) {
			gameState.spinning -= 0.2;
			gameState.spinning = Math.max(gameState.spinning, -maxSpin);
		}
		gameState.spin += 360;
		gameState.spin += gameState.spinning;
		gameState.spin %= 360;


		// applying speed if on wave (& breaks if z down)
		if (gameState.surfer.body.y > gameState.waveConfig.waveHeight) {
			this.updateVelocityX();
			this.updateVelocityY();

			if (gameState.cursors.space.isDown) {
				gameState.surfer.setVelocityX(gameState.surfer.body.velocity.x - 20);
			}
		}

		if (gameState.floater) {
			gameState.surfer.setVelocityY(-50);
			gameState.surfer.setVelocityX(gameState.surfer.body.velocity.x * 1.01);
			gameState.floaterCounter += 1;
			if (gameState.floaterCounter > 100) {
				this.scene.restart();
			}
		}



	}

	updateVelocityX() {
		gameState.surfer.setVelocityX(gameState.surfer.body.velocity.x * 0.97);
		let forwardAcceleration = 2;
		let backAcceleration = -20;
		let maxSpeed = 50;
		// surfer is facing forwards, it'll go up, else down
		if (gameState.spin > 270) {
			// max speed at 0, lowest at 270
			gameState.surfer.setVelocityX(
				gameState.surfer.body.velocity.x +
				(gameState.spin % 270) / 90 * forwardAcceleration
			);
		} else if (gameState.spin < 90) {
			gameState.surfer.setVelocityX(
				gameState.surfer.body.velocity.x +
				(90 - gameState.spin) / 90 * forwardAcceleration
			);
		} else if (gameState.spin < 180) {
			gameState.surfer.setVelocityX(
				gameState.surfer.body.velocity.x +
				(gameState.spin % 90) / 90 * backAcceleration
			)
		} else if (gameState.spin < 270) {
			gameState.surfer.setVelocityX(
				gameState.surfer.body.velocity.x +
				(90 - (gameState.spin % 180)) / 90 * backAcceleration
			)
		}
		// if surfer is past wave, then sloooww
		if (gameState.surfer.body.y > gameState.waveConfig.waveHeight + gameState.waveConfig.waveDepth) {
			gameState.surfer.setVelocityX(gameState.surfer.body.velocity.x - 50);
		}

		// throttle to max speed
		gameState.surfer.setVelocityX(Math.min(gameState.surfer.body.velocity.x, maxSpeed));
	}

	updateVelocityY() {
		gameState.surfer.setVelocityY(gameState.surfer.body.velocity.y * 0.95);
		const maxSpeed = 500;
		const minSpeed = -1500;
		const upAcceleration = -100;
		const downAcceleration = 55;
		let ySpeed = 0;
		if (gameState.spin < 90) {
			// should be full at 90, 0 at 0
			gameState.surfer.setVelocityY(
				gameState.surfer.body.velocity.y +
				(gameState.spin / 90) * upAcceleration
			)
		} else if (gameState.spin < 180) {
			// should be full at 90, 0 at 180
			gameState.surfer.setVelocityY(
				gameState.surfer.body.velocity.y +
				(90 - (gameState.spin % 90)) / 90 * upAcceleration
			)
		} else if (gameState.spin < 270) {
			// should be 0 at 180, full at 270
			gameState.surfer.setVelocityY(
				gameState.surfer.body.velocity.y +
				(gameState.spin % 180) / 90 * downAcceleration
			)
		} else {
			// should be full at 270, 0 at 360
			gameState.surfer.setVelocityY(
				gameState.surfer.body.velocity.y +
				(90 - (gameState.spin % 270)) / 90 * downAcceleration
			)
		}
		// throttle to max speed?
		gameState.surfer.setVelocityY(Math.min(gameState.surfer.body.velocity.y, maxSpeed));
		gameState.surfer.setVelocityY(Math.max(gameState.surfer.body.velocity.y, minSpeed));
	}

}

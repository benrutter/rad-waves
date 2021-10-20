class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.spritesheet('surfer', './assets/sprites/surfer.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('wave', './assets/sprites/wave.png', { frameWidth: 500, frameHeight: 200 });
		this.load.spritesheet('barrel', './assets/sprites/barrel.png', { frameWidth: 150, frameHeight: 200 });
		this.load.spritesheet('sea', './assets/sprites/sea.png', { frameWidth: 500, frameHeight: 50 });
		this.load.image('sky', './assets/sprites/clouds.png');
	}

	create() {

		gameState.spin = 0;
		gameState.breaks = 0;
		gameState.ySpeed = 0;




		gameState.cursors = this.input.keyboard.createCursorKeys();

		gameState.sky = this.add.tileSprite(0, 0, 1000, 2000, 'sky').setOrigin(0, 0);
		gameState.wave = this.add.sprite(0, 150, 'wave').setOrigin(0, 0).setScale(1.5);
		gameState.sea = this.add.sprite(0, 150 + 1.5*200, 'sea').setOrigin(0, 0).setScale(1.5);
		gameState.player = this.add.sprite(200, 200, 'surfer').setScale(2);
		gameState.barrel = this.add.sprite(0, 150, 'barrel').setOrigin(0, 0).setScale(1.5);

		gameState.player.setCollideWorldBounds(true);


		gameState.debugText = this.add.text(
			10, 10,
			`Spin: ${gameState.spin}\nFrame: ${Math.floor(gameState.spin / 360 * 16)}\nYSpeed: 0`,
			{ fontSize: '30px', fill: '#000000' }
		);

		this.cameras.main.setBounds(0, 0, gameState.wave.width * 1.5, gameState.wave.height * 1.5 + 200);
		this.physics.world.setBounds(0, 0, gameState.wave.width * 1.5, gameState.wave.height * 1.5 + 500);
		this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);


		for (let i = 1; i < 17; i++) {
			this.anims.create({
	      key: i,
	      frames: this.anims.generateFrameNumbers('surfer', { start: i-1, end: i-1 }),
	      frameRate: 5,
	      repeat: -1,
	    });
		}

		this.anims.create({
			key: 'roll',
			frames: this.anims.generateFrameNumbers('barrel'),
			frameRate: 16,
			repeat: -1,
		});

		this.anims.create({
			key: 'waving',
			frames: this.anims.generateFrameNumbers('wave'),
			frameRate: 20,
			repeat: -1,
		});

	}

	update() {
		gameState.sky.tilePositionX += 3;
		gameState.barrel.anims.play('roll', true);
		gameState.wave.anims.play('waving', true);
		let frame = Math.floor(gameState.spin / 360 * 16) + 1;
		gameState.debugText.setText(`Spin: ${gameState.spin}\nFrame: ${frame}\nYSpeed: ${this.calculateYSpeed()}\nXSpeed: ${this.calculateXSpeed()}\nPlayerY:${gameState.player.body.y}`);
		gameState.player.anims.play(frame, true);

		if (this.isOnWave()) {
			gameState.player.setVelocityY(this.calculateYSpeed());
			gameState.player.setVelocityX(this.calculateXSpeed());
		}

		if (gameState.cursors.left.isDown) {
			gameState.spin += 365;
			if (gameState.cursors.shift.isDown) {
				gameState.spin += 10;
			}
			gameState.spin %= 360;
		} if (gameState.cursors.right.isDown) {
			gameState.spin += 355;
			if (gameState.cursors.shift.isDown) {
				gameState.spin -= 10;
			}
			gameState.spin %= 360;
		} if (gameState.cursors.space.isDown && this.isOnWave()) {
			gameState.breaks -= 10;
			console.log('f');
		} else {
			gameState.breaks += 1;
			gameState.breaks = Math.min(gameState.breaks, 0);
		}
		console.log(this.isPastWave());
		if (this.isPastWave()) {
			gameState.breaks -= 30;
		}



		// if player is too far back then 'wipeout!'
		if (gameState.player.body.x < 50) {
			this.scene.restart();
		}

	}

	isOnWave() {
		let waveStart = 150;
		return gameState.player.y > waveStart;
	}

	isPastWave() {
		let waveSize = 300;
		let waveStart = 150;
		return gameState.player.y > waveStart + waveSize;
	}

	calculateXSpeed() {
		const minSpeed = -10;
		const maxSpeed = 2;
		const acceleration = 175;
		const funcSpin = (gameState.spin + 45) % 350;
		let xSpeed = 0;
		// at 0, should be maximum
		// at 180, should be minum
		if (funcSpin < 180) {
			// should be max at 0, min at 180
			let x = 180 - funcSpin;
			xSpeed = ((x / 180) * acceleration * 2);
		} else {
			// should be min at 180, max at 360
			let x = funcSpin - 180; // min at 0, max at 180
			console.log(x);
			xSpeed = ((x / 180) * acceleration * 2);
		}
		if (gameState.player.body.y < 150) {
			xSpeed += 170;
		}
		const closeToWaveGain = ((750 - gameState.player.body.x) / 750) * 20;
		return xSpeed - 250 + gameState.breaks + closeToWaveGain;
	}

	calculateYSpeed() {
		const minSpeed = -450;
		const maxSpeed = 350;
		const acceleration = 900;
		let ySpeed = 0;
		if (gameState.spin < 90) {
			// should be min at 90, 0 at 0
			let x = gameState.spin;
			ySpeed = (x / 90) * -acceleration;
		} else if (gameState.spin < 180) {
			// should be min at 90, 0 at 180
			let x = 180 - gameState.spin; //will be 0 for 180, and 90 for 90
			ySpeed = (x / 90) * -acceleration;
		} else if (gameState.spin < 270) {
			// should be 0 at 180, max at 270
			let x = 90 - (270 - gameState.spin); //will be 90 for 270, and 0 for 180
		  ySpeed =  (x / 90) * acceleration;
		} else if (gameState.spin < 360) {
			// should be maximum at 270, 0 at 360
			let x = 360 - gameState.spin; // will be 0 at 360, 90 at 270
			ySpeed = (x / 90) * acceleration;
		}

		return ySpeed;
	}
}

class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.spritesheet('surfer', './assets/sprites/surfer-sheet.png', { frameWidth: 100, frameHeight: 110 });
		this.load.spritesheet('wave', './assets/sprites/wave-sheet.png', { frameWidth: 500, frameHeight: 300 });
		this.load.image('sky', './assets/sprites/clouds.png');
	}

	create() {

    // controllers and set-up
    gameState.cursors = this.input.keyboard.createCursorKeys();
		gameState.onWave = false;
		gameState.speed = 0;
		gameState.flipCounter = 0;

		this.bg = this.add.tileSprite(0, 0, 1000, 2000, 'sky')
            .setOrigin(0, 0);

		// surfer and sprites
		gameState.wave = this.add.sprite(0, 500, 'wave').setOrigin(0, 0).setScale(2);
		this.cameras.main.setBounds(0, 0, gameState.wave.width * 2, gameState.wave.height * 2 + 500);
		this.physics.world.setBounds(0, 0, gameState.wave.width * 2, gameState.wave.height * 2 + 500);






		gameState.player = this.physics.add.sprite(200, 200, 'surfer').setScale(1);
		gameState.player.setCollideWorldBounds(true);
		this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);



		this.anims.create({
      key: 'surfing',
      frames: this.anims.generateFrameNumbers('surfer', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });
		this.anims.create({
      key: 'wave',
      frames: this.anims.generateFrameNumbers('wave', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1
    });

		this.physics.add.collider(gameState.player, gameState.wave, player => {
			console.log('f');
      gameState.onWave = true;
    });
	}

	update() {

		this.bg.tilePositionX += 10;
		gameState.flipCounter++;

		// get the right surfer pic
		gameState.wave.anims.play('wave', true);
		gameState.player.anims.play('surfing', true);


		if (gameState.player.y > 500) {
			// some angular velocity stuff i guess''
	    gameState.player.body.velocity.x = 0;
	    gameState.player.body.velocity.y = 0;
	    gameState.player.body.angularVelocity = 0;


			if (gameState.cursors.left.isDown) {
				gameState.player.body.angularVelocity = -200;
			}
			if (gameState.cursors.right.isDown) {
				gameState.player.body.angularVelocity = 200;
			}
			if (gameState.cursors.space.isDown && gameState.flipCounter > 50) {
				console.log('nice');
				console.log(gameState.player.body);
				gameState.player.angle += 180;
				gameState.flipCounter = 0;
				gameState.speed = 0;
			}

			gameState.speed += 10;
		  this.physics.velocityFromAngle(gameState.player.angle, gameState.speed, gameState.player.body.velocity);
		} else {
			gameState.speed -= 50;
			gameState.speed = Math.max(gameState.speed, 0);
		}
	}
}

class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('wave', './assets/sprites/wave.png');
		this.load.image('spray', 'assets/particles/white.png');
		this.load.image('skull', '/assets/sprites/skull.png');
		this.load.spritesheet('surfer', './assets/sprites/surfer.png', { frameWidth: 15, frameHeight: 15 });
		this.load.spritesheet('coin', './assets/sprites/coin.png', { frameWidth: 10, frameHeight: 10});
	}

	create() {

		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 4}),
			frameRate: 10,
			repeat: -1,
		  })

		gameState.wave = new Wave(this, 'wave', 'spray');
		this.physics.world.setBounds(0, 0, game.config.width*3, gameState.wave.waveHeight + gameState.wave.waveDepth + gameState.wave.waveBottom);

		gameState.player = new Surfer(this, 'surfer', gameState.wave);
		gameState.wave.drawWave();

		// SKULLS!
		gameState.skulls = this.physics.add.group();
		const makeSkull = () => {
			gameState.skulls.create(5000, Math.random() * (gameState.wave.waveDepth + gameState.wave.waveBottom) + gameState.wave.waveHeight, 'skull')
            	.setVelocityX(-800)
            	.setScale(3);
		}
		this.time.addEvent({
            delay: 450,
            callback: makeSkull,
            callbackScope: this,
            loop: true,
        })

		// COINS!
		gameState.coins = this.physics.add.group();
		const makeCoin = () => {
			gameState.coins.create(5000, Math.random() * (gameState.wave.waveDepth + gameState.wave.waveBottom) + gameState.wave.waveHeight, 'coin')
            	.setVelocityX(-800)
            	.setScale(3)
				.anims.play('spin', true);
		}
		this.time.addEvent({
            delay: 450,
            callback: makeCoin,
            callbackScope: this,
            loop: true,
        })

		gameState.player.draw();
		gameState.wave.drawBarrel();

		this.cameras.main.startFollow(gameState.player.sprite, true, 0.5, 0.5);
		this.cameras.main.setBounds(0, 0, game.config.width*3, gameState.wave.waveHeight + gameState.wave.waveDepth + gameState.wave.waveBottom + 200);

	}


	update() {

		if (gameState.player.wipedout) {
			this.add.text(gameState.player.sprite.body.x, gameState.player.sprite.body.y, `That wave was ${gameState.player.score}% rad \npress space to start again!`, { fontSize: '40px', fill: '#FF7276' }).setOrigin(0.5);

			this.input.keyboard.on('keyup-SPACE', () => {
				this.scene.restart();
			});

		} else {
				gameState.player.update();

				gameState.skulls.getChildren().forEach((item, i) => {
					if (item.body.x < 0) {
						item.destroy();
					} else if (
							item.body.x < gameState.player.sprite.body.x + 30 &
							item.body.x > gameState.player.sprite.body.x &
							item.body.y < gameState.player.sprite.body.y + 30 &
							item.body.y > gameState.player.sprite.body.y) {
						gameState.player.wipeout();
					}
				});

				gameState.coins.getChildren().forEach((item, i) => {
					if (item.body.x < 0) {
						item.destroy();
					} else if (
							item.body.x < gameState.player.sprite.body.x + 50 &
							item.body.x > gameState.player.sprite.body.x &
							item.body.y < gameState.player.sprite.body.y + 50 &
							item.body.y > gameState.player.sprite.body.y) {
						gameState.player.celebrate(50);
						item.destroy();
					}
				});

			}


	}


}

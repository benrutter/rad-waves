class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('wave', './assets/sprites/wave.png');
		this.load.image('spray', 'assets/particles/white.png');
		this.load.spritesheet('surfer', './assets/sprites/surfer.png', { frameWidth: 15, frameHeight: 15 });
	}

	create() {

		gameState.wave = new Wave(this, 'wave', 'spray');
		this.physics.world.setBounds(0, 0, game.config.width*3, gameState.wave.waveHeight + gameState.wave.waveDepth + gameState.wave.waveBottom);

		gameState.player = new Surfer(this, 'surfer', gameState.wave);
		gameState.wave.drawWave();


		gameState.player.draw();
		gameState.wave.drawBarrel();

		this.cameras.main.startFollow(gameState.player.sprite, true, 0.5, 0.5);
		this.cameras.main.setBounds(0, 0, game.config.width*3, gameState.wave.waveHeight + gameState.wave.waveDepth + gameState.wave.waveBottom + 200);

	}


	update() {

		if (gameState.player.wipedout) {
			this.add.text(gameState.player.sprite.body.x, gameState.player.sprite.body.y, `That wave was ${gameState.player.score}% rad \nclick to start again!`, { fontSize: '40px', fill: '#FF7276' }).setOrigin(0.5);

			this.input.on('pointerup', () => {
				this.scene.restart();
			});
		} else {
				gameState.player.update();
			}
	}


}

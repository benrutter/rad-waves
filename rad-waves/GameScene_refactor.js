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
		gameState.player.update();
	}


}

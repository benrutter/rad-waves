class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.spritesheet('wave', './assets/sprites/wavee.png', { frameWidth: 25, frameHeight: 1000});
		this.load.spritesheet('barrel', 'assets/sprites/barrel.png', { frameWidth: 500, frameHeight: 1000});
	}

	create() {
		this.createWaves();
		this.createBarrel();
	}

	update() {
		//this.updateWaves();

	}

	createWaves() {
		this.anims.create({
      key: 'waveRoll',
      frames: this.anims.generateFrameNumbers('wave'),
      frameRate: 15,
      repeat: -1
    });

		gameState.waveConfig = {
			waveTime: 0,
			barrelSize: 750,
		};
		gameState.wave = this.add.group();
		for (let i = 0; i < game.config.width; i+=25) {
			gameState.wave.create(i, 100, 'wave').setOrigin(0, 0).anims.play('waveRoll', true);
		}
		gameState.sprays = [];
	}

	createBarrel() {
		gameState.barrel = this.add.sprite(0, 100, 'barrel').setOrigin(0, 0);
	}

	waveMovement(x) {
		x += gameState.waveConfig.waveTime * 5;
		let y = Math.sin(x * 0.002) * 50;
		return y ;
	}

	updateWaves() {
		gameState.waveConfig.waveTime += 1;
	  // this.count increments every frame. gives us a constantly
	  // increasing X value for our sin function
	  gameState.wave.getChildren().forEach((currentWave, i) => {
			currentWave.y = 100 + this.waveMovement(i*18);
	  }, this);
	}

}

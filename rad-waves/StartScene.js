class StartScene extends Phaser.Scene {

	constructor() {
		super({ key: 'StartScene' })
	}

  preload() {

  }

	create() {

    // variables forW placement
    const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const fullY = this.cameras.main.worldView.y + this.cameras.main.height;
    const fullX = this.cameras.main.worldView.x + this.cameras.main.width;

      // intro text
		this.add.text(centerX, centerY - 100, 'RAD WAVES!!!', {fill: '#FFFFFF', fontSize: '80px'}).setOrigin(0.5);
		this.add.text(centerX, centerY + 50, 'Left and Right to steer', {fill: '#FFFFFF', fontSize: '40px'}).setOrigin(0.5);
		this.add.text(centerX, centerY + 100, 'A speeds up, S slows down', {fill: '#FFFFFF', fontSize: '40px'}).setOrigin(0.5);
    this.add.text(centerX, centerY + 150, 'Press Space to start', {fill: '#FFFFFF', fontSize: '40px'}).setOrigin(0.5);

    // click to start
    this.input.keyboard.on('keyup-SPACE', () => {
			this.scene.stop('StartScene')
			this.scene.start('GameScene')
		})

	}
}

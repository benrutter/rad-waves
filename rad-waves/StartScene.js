class StartScene extends Phaser.Scene {

	constructor() {
		super({ key: 'StartScene' })
	}

  preload() {

  }

	coolText(text, size, x, y) {
		this.add.text(x + 3, y + 3, text, { fontSize: size + 'px', fill: '#000000', fontFamily: 'CustomFont', backgroundColor: '#202020'}).setOrigin(0.5);
		this.add.text(x, y, text, { fontSize: size + 'px', fill: '#FF7276', fontFamily: 'CustomFont' }).setOrigin(0.5);
	}

	create() {

    // variables forW placement
    const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const fullY = this.cameras.main.worldView.y + this.cameras.main.height;
    const fullX = this.cameras.main.worldView.x + this.cameras.main.width;

    // title text
		const title = 'RAD WAVES';
		this.coolText(title, 50, centerX, 50 + 100);

		// start text
		const startText = '(press space to start)';
		this.coolText(startText, 40, centerX, 100 + 100);
		// controls!
		const controls = 'left &\nright to steer\nA to Speed Up\nS to Slow down';
		this.coolText(controls, 20, centerX - centerX/2, 200 + 100);

		// points!
		const points = 'turning, jumping,\nbarrels & coins\nare rad\nlanding face up\n& skulls are bad';
		this.coolText(points, 20, centerX + centerX/2, 200 + 100);


    // click to start
    this.input.keyboard.on('keyup-SPACE', () => {
			this.scene.stop('StartScene')
			this.scene.start('GameScene')
		})

	}
}

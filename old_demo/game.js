const gameState = {

};

const config = {
	type: Phaser.AUTO,
	width: 700,
	height: 500,
	backgroundColor: "EEEEFF",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 1200},
			enableBody: true,
		}
	},
	scene: [GameScene]
};

const game = new Phaser.Game(config);

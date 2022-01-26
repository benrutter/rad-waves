
const gameState = {
};

const config = {
	type: Phaser.AUTO,
	width: 1500,
	height: 700,
	backgroundColor: "88CEEB",
	antialias: false,
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
		}
	},
	scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);

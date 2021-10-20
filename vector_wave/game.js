const gameState = {

};

const config = {
	type: Phaser.AUTO,
	width: 3000,
	height: 1000,
	backgroundColor: "88CEEB",
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

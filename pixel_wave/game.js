const gameState = {

};

const config = {
	type: Phaser.AUTO,
	width:2200,
	height: 750,
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

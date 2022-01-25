class Wave {

  constructor(context, waveSprite, spraySprite) {
    this.context = context;
    this.waveTime = 0;
    this.barrelSize = 1000;
    this.waveHeight = 600;
    this.waveDepth = 700;
    this.waveSpeed = 800;
    this.waveBottom = 100;
    this.waveSpriteWidth = 250;
    this.waveSprite = waveSprite;
    this.spraySprite = spraySprite;
  }

  drawWave() {
    // adding wave sprites as group into context
    this.waveGroup = this.context.add.group();
    // drawing wave face
		for (let i = 0; i < game.config.width*3; i += this.waveSpriteWidth) {
			this.waveGroup.create(i, this.waveHeight, this.waveSprite).setOrigin(0, 0);
		}
    // creating the 'spray' at top of wave
    const particles = this.context.add.particles(this.spraySprite);
    for (let i = this.barrelSize; i < game.config.width*3; i += 10) {
      particles.createEmitter({
        x: {min: i, max: i+10},
        y: this.waveHeight,
        lifespan: 25,
        speedX: { min:-850, max:0 },
        speedY: { min:-400, max:400 },
        // I don't really like this maths, it should really figure out the point it should start at
        scale: { start: Math.max(((game.config.width - i)/game.config.width) * 5, 0.5), end: 0.4 },
        quantity: 0.5,
        gravityY: 900,
        blendMode: 'ADD'
      });
    }

  }

  drawBarrel() {
    const particles = this.context.add.particles(this.spraySprite);
    for (let i = 0; i < this.barrelSize; i += 20) {
      particles.createEmitter({
        x: {min: i, max: i+150},
        y: this.waveHeight,
        lifespan: 1500,
        speedX: { min:-850, max:0 },
        speedY: { min: -400, max: 1400 },
        scale: { start: 1.3, end: 0 },
        quantity: 0.00000001,
        gravityY: 900,
        blendMode: 'ADD'
      });
    }
  }

  isOnWave(x, y) {
    return y > this.waveHeight;
  }

}

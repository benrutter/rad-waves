class Surfer {

  constructor(context, surferSprite, wave) {
    this.context = context;
    this.surferSprite = surferSprite;
    this.spin = 0;
    this.spinSpeed = 10;
    this.traction = 0.98;
    this.spinning = 0;
    this.maxSpinning = 5;
    this.floater = false;
    this.maxSpeed = 1000;
    this.waveHeight = wave.waveHeight;
    this.speed = 700;
    this.weight = 15;
    this.jump = 500;
    this.stall = 1000;
    this.waveSpeed = 200;
    this.airCounter = 0;
    this.createAnims();
    this.setControls();
  }

  createAnims() {
    for (let i = 1; i < 17; i++) {
      this.context.anims.create({
        key: i,
        frames: this.context.anims.generateFrameNumbers('surfer', { start: i-1, end: i-1 }),
        frameRate: 5,
        repeat: -1,
      });
    }
  }

  setControls() {
    // steer
    this.context.input.keyboard.on('keydown-LEFT', () => {
			this.spinning += this.spinSpeed;
      this.spinning = Math.min(this.spinning, this.maxSpinning);
		});
    this.context.input.keyboard.on('keydown-RIGHT', () => {
      this.spinning -= this.spinSpeed;
      this.spinning = Math.max(this.spinning, -this.maxSpinning);
    });
    // jump
    this.context.input.keyboard.on('keyup-A', () => {
      this.jumpCounter = 50;
      this.speed += this.jump;
    });
    // stall
    this.context.input.keyboard.on('keydown-S', () => {
      // this isn't going to do much until speed mechanics are more developed
      this.speed -= this.stall;
    });
  }

  draw() {
    this.sprite = this.context.physics.add.sprite(
      500,
      500,
      this.surferSprite
    ).setScale(2).setCollideWorldBounds(true);
  }

  update() {
    this.updateRotation();
    if (this.sprite.body.y < this.waveHeight) {
      this.updateMovementOffWave();
      this.airCounter += 1;
    } else {
      this.updateMovementOnWave();
      this.airCounter = 0;
      this.jumpCounter -= 1;
    }
    this.updateSprite();
  }

  updateRotation() {
    this.spinning *= this.traction;
    this.spin += 360 + this.spinning;
    this.spin %= 360;
  }


  updateMovementOnWave() {

    if (this.jumpCounter <= 0) {
      // for now, just move the speed closer and closer to max speed
      this.speed = (this.speed + this.maxSpeed) / 2;
      this.speed = Math.max(this.speed, this.maxSpeed);
    }
    let angle = this.spin * Math.PI / 180;
    this.sprite.setVelocityX((this.speed * Math.cos(angle))-this.waveSpeed);
    //console.log(this.sprite.body.velocity.x)
    this.sprite.setVelocityY(-this.speed * Math.sin(angle));
  }

  updateMovementOffWave() {

    this.sprite.setVelocityY(this.sprite.body.velocity.y + (this.weight * (this.airCounter/5)));
  }

  updateSprite() {
    let frame = Math.floor(this.spin / 360 * 16) + 1;
    this.sprite.anims.play(frame, true);
  }

}

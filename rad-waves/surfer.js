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
    this.waveHeight = wave.waveHeight;
    this.speed = 700;
    this.maxSpeed = 2000;
    this.weight = 15;
    this.boost = 20;
    this.jump = 500;
    this.state = 'norm';
    this.stall = 10;
    this.minSpeed = 100;
    this.waveSpeed = 0.4;
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
    this.context.input.keyboard.on('keydown-A', () => {
      this.state = 'boost';
      console.log('woo');

    });
    this.context.input.keyboard.on('keyup-A', () => {
      this.state = 'norm';
    });
    // stall
    this.context.input.keyboard.on('keydown-S', () => {
      this.state = 'stall';
      this.speed -= this.stall;
      this.speed = Math.max(this.speed, this.minSpeed);
    });
    this.context.input.keyboard.on('keyup-S', () => {
      this.state = 'norm';
    });
  }

  draw() {
    this.sprite = this.context.physics.add.sprite(
      1500,
      500,
      this.surferSprite
    ).setScale(5).setCollideWorldBounds(true);
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
    if (this.state == 'boost') {
      this.speed += this.boost;
      this.speed = Math.min(this.speed, this.maxSpeed);
    } else if (this.state == 'stall') {
      this.speed -= this.stall;
      this.speed = Math.max(this.speed, 0);
    }
    this.speed *= 0.99;
    let angle = this.spin * Math.PI / 180;
    this.sprite.setVelocityX((this.speed * Math.cos(angle))-this.waveSpeed*(this.sprite.body.x+this.sprite.body.y));
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

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
    this.waveDepth = wave.waveDepth;
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
    this.wipeodut = false;
    this.celebrateCounter = 0;
    this.score = 0;
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
    this.context.anims.create({
      key: 'wipeout',
      frames: this.context.anims.generateFrameNumbers('surfer', { start: 17, end: 24}),
      frameRate: 5,
      repeat: 0,
    })
  }

  wipeout() {
    this.wipedout = true;
    this.speed = 0;
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
    this.sprite.anims.play('wipeout', true);
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

  celebrate(points) {
    if (this.celebrateCounter > 40) {
      this.text = this.context.add.text(gameState.player.sprite.body.x, gameState.player.sprite.body.y, 'Rad!', { fontSize: '30px', fill: '#FF7276' }).setOrigin(0.5);
      this.celebrateCounter = 0;
      this.score += points;
    }
  }

  draw() {
    this.sprite = this.context.physics.add.sprite(
      1500,
      this.waveHeight + 100,
      this.surferSprite
    ).setScale(5).setCollideWorldBounds(true);
  }

  update() {
    this.celebrateCounter += 1;
    this.updateRotation();
    if (this.sprite.body.y < this.waveHeight) {
      this.updateMovementOffWave();
      this.airCounter += 1;
    } else {
      this.updateMovementOnWave();
      this.airCounter = 0;
      this.jumpCounter -= 1;
    }
    // check if on wave tip, and moving down
    if (this.sprite.body.y > this.waveHeight - 80 & this.sprite.body.y < this.waveHeight & this.sprite.body.velocity.y > 0) {
      // if rotation isn't facing more or less straight down
      if (this.spin < 210 | this.spin > 330) {
        this.wipeout();
      } else if (this.sprite.body.x < this.waveDepth) {
        this.wipeout();
      } else {
        this.celebrate(100);
      }
    }
    if (!this.wipedout) {
      this.updateSprite();
    }

    if (this.celebrateCounter > 30 & this.celebrateCounter < 40) {
      if (this.text) {
        this.text.destroy();
      }
    }
    if (this.spinning > 4 | this.spinning < -4) {
      this.celebrate(40);
    }
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

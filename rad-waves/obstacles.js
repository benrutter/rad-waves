class Obstacle {
    constructor(context, group, sprite) {
        this.context = context;
        this.sprite = sprite;
        this.group = group;
        this.speed = 800;
      }

    generate() {
        console.log(this.context);
        //const yCoord = Math.random() * this.context.physics.world.bounds.y;
        this.group.create(60, 600, this.sprite)
            .setVelocityY(this.speed)
            .setScale(1)
    }

    generateLoop() {
        this.context.time.addEvent({
            delay: 250,
            callback: this.generate,
            callbackScope: this.context,
            loop: true,
        })
    }

}
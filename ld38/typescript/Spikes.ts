class Spikes extends Orbital {
    sprite;
    body;

    constructor(rotation, outwardDistance, width) {
        super(rotation, outwardDistance + 8);
        const height = 16;

        this.body = new p2.Body({
            position: [this.body.position[0], this.body.position[1]],
            collisionResponse: false
        });
        this.body.addShape(new p2.Box({width: width, height: height}));
        this.body.angle = rotation;
        game.physicsWorld.addBody(this.body);
        this.sprite = game.phaser.add.tileSprite(
            this.body.position[0], 
            this.body.position[1], 
            width,
            height,
            'spikes'
        );
        this.sprite.rotation = rotation;
        this.sprite.anchor.set(.5, .5);
    }

    update() {
        this.setRotation(this.body.angle + .01);
        this.sprite.position = {x: this.body.position[0], y: this.body.position[1]};
        this.sprite.rotation = this.body.angle;
        if (this.body.overlaps(game.player.body)) game.player.die();
    }
}
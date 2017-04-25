class Player extends GameObject {
    sprite;
    body;

    constructor() {
        super();

        const height = 32;
        const width = 32;

        this.body = new p2.Body({
            mass: 5, 
            position: [game.planetTop.x, game.planetTop.y - height / 2],
            fixedX: true,
            fixedRotation: true
        });
        this.sprite = game.phaser.add.sprite(this.body.position.x, this.body.position.y, 'player');
        this.sprite.anchor.set(.5, .5);
        this.body.addShape(new p2.Box({width: width, height: height}));
        game.physicsWorld.addBody(this.body);
    }

    update() {
        this.sprite.position = this.positionFromPhysics();
    }
  
    jump() {
        for (const thing of game.levelObjects.blocks.concat({body: game.planetSurfaceBody}))
            if (this.body.overlaps(thing.body)) {
                this.body.applyImpulse([0, -2000]);
                if (game.soundsLoaded) game.sounds.jump.play();
                break;
            }
    }

    die() {
        if (game.soundsLoaded) game.sounds.die.play();
        game.gameOverSign.visible = true;
        this.body.collisionResponse = false;
        game.phaser.time.events.add(1000, () => {
            // game.gameOverSign.visible = false;
            // this.body.collisionResponse = true;
            // game.loadLevel(0);
            game.phaser.state.start('startScreen')
        });
    }
}
class Orbital {
    body = {position: [], angle: 0};
    sprite;

    constructor(rotation, public outwardDistance) {
        this.setRotation(rotation);
    }

    setRotation(rotation) {
        this.body.angle = rotation;
        this.setPostionFromRotation();
    }

    setPostionFromRotation() {
        const x = game.width / 2,
              y = game.planetTop.y - this.outwardDistance,
              centerX = game.width / 2,
              centerY = game.height / 2;
        this.body.position = [
            Math.cos(this.body.angle) * (x - centerX) - Math.sin(this.body.angle) * (y - centerY) + centerX,
            Math.sin(this.body.angle) * (x - centerX) + Math.cos(this.body.angle) * (y - centerY) + centerY
        ];
    }

    destroy() {
        game.physicsWorld.removeBody(this.body);
        this.sprite.destroy();
    }
}

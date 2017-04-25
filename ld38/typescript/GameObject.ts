class GameObject {
    position;
    body;

    positionObjectToArray() {
        return [this.position.x, this.position.y];
    }

    positionFromPhysics() {
        return {x: this.body.position[0], y: this.body.position[1]};
    }
}
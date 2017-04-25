const finishedState = {
    create() {
        this.add.text(0, 0, 'nice going you finished the game', {fill: 'white'});
        game.phaser.time.events.add(2000, () => this.state.start('startScreen'));
    }
};
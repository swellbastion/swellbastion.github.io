const playState = {

    preload() {
        this.load.image('player', 'images/player.png');
        this.load.image('planet', 'images/planet.png');
        this.load.image('block', 'images/block.png');
        this.load.image('nextLevelTrigger', 'images/next-level.png');
        this.load.image('spikes', 'images/spikes.png');
        this.load.image('gameOver', 'images/game-over.png');

        this.load.audio('jump', 'sounds/jump.mp3');
        this.load.audio('die', 'sounds/die.mp3');
        this.load.audio('nextLevel', 'sounds/next-level.mp3');
    },

    create() {
        game.sounds.jump = this.add.audio('jump');
        game.sounds.die = this.add.audio('die');
        game.sounds.nextLevel = this.add.audio('nextLevel');

        this.sound.setDecodedCallback([ game.sounds.jump, game.sounds.die, game.sounds.nextLevel ], () => game.soundsLoaded = true)

        game.physicsWorld = new p2.World({gravity: [0, 900]});
        this.add.sprite(game.width / 2, game.height / 2, 'planet').anchor.setTo(.5, .5);

        game.planetSurfaceBody = new p2.Body({position: [game.width / 2 - 1, game.planetTop.y + 4]})
        game.planetSurfaceBody.addShape(new p2.Box({width: 2, height: 8}))
        game.physicsWorld.addBody(game.planetSurfaceBody);

        game.player = new Player;
        game.gameOverSign = this.add.sprite(game.width / 2, game.height / 2, 'gameOver');
        game.gameOverSign.anchor.setTo(.5, .5);
        game.gameOverSign.visible = false;

        game.loadLevel(0);
        game.controls = new Controls;
    },

    update() {
        game.physicsWorld.step(1/60);
        game.player.update();
        for (const block of game.levelObjects.blocks) block.update();
        for (const trigger of game.levelObjects.nextLevelTriggers) trigger.update();
        for (const spike of game.levelObjects.spikes) spike.update();
    }
};
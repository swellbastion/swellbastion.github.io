class Game {
    width = 640;
    height = 640;
    planetRadius = 150;
    planetTop = {x: this.width / 2, y: this.height / 2 - this.planetRadius};
    phaser = new Phaser.Game(this.width, this.height);
    physicsWorld;
    levelObjects = {blocks: [], nextLevelTriggers: [], spikes: []};
    player;
    controls;
    currentLevelNumber;
    gameOverSign;
    planetSurfaceBody;
    sounds: any = {};
    soundsLoaded = false;

    constructor() {
        this.phaser.state.add('startScreen', startScreenState);
        this.phaser.state.add('play', playState);
        this.phaser.state.add('finished', finishedState);
        this.phaser.state.start('startScreen');
    }

    loadLevel(number) {
        if (!levels[number]) {
            this.phaser.state.start('finished');
            return;
        }
        this.currentLevelNumber = number;
        for (const group in this.levelObjects) {
            for (const object of this.levelObjects[group]) object.destroy();
            this.levelObjects[group] = [];
        }
        for (const blockData of levels[number].blocks) 
            this.levelObjects.blocks.push(
                new Block(
                    blockData[0] * Math.PI / 180,
                    blockData[1], 
                    blockData[2]
                )
            );
        for (const trigger of levels[number].nextLevelTriggers) 
            this.levelObjects.nextLevelTriggers.push(
                new NextLevelTrigger(trigger[0] * Math.PI / 180, trigger[1])
            );
        for (const spike of levels[number].spikes) 
            this.levelObjects.spikes.push(
                new Spikes(spike[0] * Math.PI / 180, spike[1], spike[2])
            );
            
        this.player.body.position = [
            this.planetTop.x, 
            this.planetTop.y - this.player.body.shapes[0].height / 2
        ];
    }

    loadNextLevel() {
        this.loadLevel(this.currentLevelNumber + 1);
    }
}

const game = new Game;
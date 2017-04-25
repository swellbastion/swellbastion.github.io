const startScreenState = {
    create() {
        this.add.text(0, 0, 'press any key to start', {fill: 'white'});
        this.input.keyboard.onDownCallback = () => {
            this.input.keyboard.onDownCallback = null;
            this.state.start('play');
        }
    }
};
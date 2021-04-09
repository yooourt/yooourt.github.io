class SceneOver extends GuaScene {
    constructor(game, option) {
        super(game)
        this.stage(option)
    }

    stage(option) {
        this.addElement(option.background)
        this.background = option.background

        this.addElement(option.pipes)
        this.pipes = option.pipes

        this.addElement(option.ground)
        this.ground = option.ground

        this.addElement(option.bird)
        this.bird = option.bird

        let e = GuaImage.new(this.game, 'game_over')
        e.x = 150
        e.y = 120
        this.addElement(e)

        this.addElement(option.score)
        this.score = option.score

        setTimeout(() => {
            let hint = GuaImage.new(this.game, 'press_j')
            hint.x = 30
            hint.y = 350
            this.addElement(hint)

            this.setupInputs()
        }, 500);
    }

    setupInputs() {
        let removeAction = this.game.registerAction('j', () => {
            removeAction()

            let s = SceneMain.new(this.game, {
                bird: {
                    x: 174,
                    y: 250,
                },
            })
            this.game.replaceScene(s)
        })
    }

}
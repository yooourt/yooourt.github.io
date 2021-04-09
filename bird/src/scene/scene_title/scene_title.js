class SceneTitle extends GuaScene {
    constructor(game) {
        super(game)
        this.initialize()
    }

    initialize() {
        this.stage()
        this.setupInputs()
    }

    stage() {
        let bg = GuaImage.new(this.game, 'bg')
        this.addElement(bg)
        this.background = bg

        let g = Ground.new(this.game)
        this.addElement(g)
        this.ground = g

        let e = GuaImage.new(this.game, 'get_ready')
        e.x = 150
        e.y = 120
        this.addElement(e)

        let b = BirdFlying.new(this.game)
        b.x = 174
        b.y = 250
        this.addElement(b)
        this.bird = b

        let hint = GuaImage.new(this.game, 'press_j')
        hint.x = 30
        hint.y = 350
        this.addElement(hint)
    }

    setupInputs() {
        let removeAction = this.game.registerAction('j', () => {
            removeAction()

            let s = SceneMain.new(this.game, {
                bird: {
                    x: this.bird.x,
                    y: this.bird.y,
                },
            })
            this.game.replaceScene(s)
        })
    }
}
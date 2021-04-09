class SceneMain extends GuaScene {
    constructor(game, config) {
        super(game)
        this.initialize(config)
    }

    initialize(config) {
        let bg = GuaImage.new(this.game, 'bg')
        this.addElement(bg)
        this.background = bg

        let pipes = Pipes.new(this.game)
        this.addElement(pipes)
        this.pipes = pipes

        let g = Ground.new(this.game)
        this.addElement(g)
        this.ground = g

        let score = Score.new(this.game)
        score.x = 250
        score.y = 50
        this.addElement(score)
        this.score = score

        let b = BirdMain.new(this.game)
        b.x = config.bird.x
        b.y = config.bird.y
        this.addElement(b)
        this.bird = b

        this.listen('collided', () => {
            this.gameOver()
        })

        this.listen('score', () => {
            this.score.add1()
        })
    }

    debug() {
        if (isNil(this.debug.gameOver)) {
            this.debug.gameOver = this.gameOver
        }
        if (config.control.invincible.value == 1) {
            this.gameOver = function() { }
        } else {
            this.gameOver = this.debug.gameOver
        }
    }

    gameOver() {
        this.bird.fall()
        this.pipes.stop()
        this.ground.stop()
        let s = SceneOver.new(this.game, this)
        this.game.replaceScene(s)
    }
}
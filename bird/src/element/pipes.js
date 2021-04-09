class Pipe extends New {
    constructor(game, gap) {
        super()
        this.game = game

        this.pipe1 = GuaImage.new(game, 'pipe')
        this.pipe1.flipY = true
        this.pipe2 = GuaImage.new(game, 'pipe')

        this.w = this.pipe1.w
        this.speed = 7

        let ry = randomInt(200, 510)
        this.pipe1.y = ry - gap - this.pipe1.h
        this.pipe2.y = ry

        this.scoreLine = {
            w: 1,
            h: 560,
            x: 0,
            y: 0,
            hit: false,
        }
    }

    update() {
        this.x -= this.speed
        this.pipe1.x = this.x
        this.pipe2.x = this.x

        let bird = this.game.scene.bird
        if (collided(bird, this.pipe1) ||
            collided(bird, this.pipe2)) {
            // this.game.scene.gameOver()
            this.game.scene.trigger('collided')
        }

        this.scoreLine.x = this.x + this.w / 2
        if (collided(bird, this.scoreLine) && !this.scoreLine.hit) {
            this.scoreLine.hit = true
            this.game.scene.trigger('score')
        }
    }

    draw() {
        this.pipe1.draw()
        this.pipe2.draw()
    }

    debug() {
        this.speed = config.control.pipe_speed.value
    }
}

class Pipes extends New {
    constructor(game) {
        super()
        this.game = game
        this.pipes = []
        this.gapHorizontal = 200
        this.gapVertical = 150
        this.paused = false

        let p = Pipe.new(game, this.gapVertical)
        p.x = 520
        this.pipes.push(p)
    }

    update() {
        if (this.paused) {
            return
        }

        // remove pipe
        this.pipes = this.pipes.filter(p => {
            return p.x + p.w >= 0
        })

        // add pipe
        let canvasW = 480
        let stageW = 40
        let last = this.pipes[this.pipes.length - 1]
        let x = last.x + last.w + this.gapHorizontal
        if (x < canvasW + stageW) {
            let p = Pipe.new(this.game, this.gapVertical)
            p.x = x
            this.pipes.push(p)
        }

        for (let p of this.pipes) {
            p.update()
        }
    }

    draw() {
        for (let p of this.pipes) {
            p.draw()
        }
    }

    stop() {
        this.paused = true
    }

    debug() {
        this.gapHorizontal = config.control.pipe_gap_horizontal.value
        this.gapVertical = config.control.pipe_gap_vertical.value
        this.pipes.forEach(p => p.debug())
    }
}
class Score extends New {
    constructor(game) {
        super()
        this.game = game
        this.x = 0
        this.y = 0
        this.score = 0
    }

    add1() {
        this.score += 1
    }

    debug() {
        this.add1 = function() {
            config.control.score.value += 1
        }
        this.score = config.control.score.value
    }

    draw() {
        let score = String(this.score)
        let offset = 0
        let gap = 2

        let imgs = []
        for (let i = 0; i < score.length; i += 1) {
            let n = score[i]

            let img = GuaImage.new(this.game, 'number' + n)
            img.x = offset + this.x
            img.y = this.y
            imgs.push(img)

            offset += img.w + gap
        }

        let widthTotal = offset - gap
        imgs.forEach(img => {
            img.x -= widthTotal / 2
            img.draw()
        })
    }

    update() {

    }
}


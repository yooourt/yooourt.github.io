class BirdMain extends Bird {
    constructor(game) {
        super(game)

        this.gy = 10
        this.vy = 0
        this.rotation = 0

        this.setupInputs()
    }

    update() {
        super.update()

        this.y += this.vy
        this.vy += this.gy * 0.2

        let groundH = 560
        let h = groundH - this.frame.h + 4
        if (this.y > h) {
            this.y = h
            this.vy = 0
        }

        if (this.rotation < 45) {
            this.rotation += 5
        }
    }

    draw() {
        this.frame.rotation = this.rotation
        this.frame.draw()
    }

    jump () {
        this.vy = -10
        this.rotation = -45
    }

    setupInputs() {
        this.removeActionJump = this.game.registerAction('j', () => {
            this.jump()
        })
    }

    fall() {
        this.removeActionJump()
        this.stopAnimate()
    }
}
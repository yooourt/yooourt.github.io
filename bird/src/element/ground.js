class Ground extends New  {
    constructor(game) {
        super()
        this.game = game
        this.paused = false
        this.tiles = []
        for (let i = 0; i < 30; i += 1) {
            let t = GuaImage.new(this.game, 'ground')
            let o = i * t.w
            t.originX = o
            t.x = o
            t.y = 560
            this.tiles.push(t)
        }
    }

    update() {
        if (this.paused) {
            return
        }

        for (let t of this.tiles) {
            if (t.originX - t.x > t.w) {
                t.x = t.originX
            } else {
                t.x -= 5
            }
        }

        for (let t of this.tiles) {
            let bird = this.game.scene.bird
            if (collided(bird, t)) {
                // this.game.scene.gameOver()
                this.game.scene.trigger('collided')
            }
        }
    }

    draw() {
        for (let t of this.tiles) {
            t.draw()
        }
    }

    stop() {
        this.paused = true
    }
}

class GuaImage extends New {
    constructor(game, name) {
        super()
        this.game = game

        const t = game.imageByName(name)
        this.image = t
        this.w = t.width
        this.h = t.height
        this.x = 0
        this.y = 0
        this.flipY = false
        this.flipX = false
        this.rotation = 0
    }

    position(x, y) {
        this.x = x
        this.y = y
    }

    update() {
    }

    draw() {
        let context = this.game.context

        let f = this
        let w2 = f.w / 2
        let h2 = f.h / 2
        let flipX = this.flipX ? -1 : 1
        let flipY = this.flipY ? -1 : 1

        context.save()
        context.translate(f.x + w2, f.y + h2)
        context.scale(flipX, flipY)
        context.rotate(this.rotation * Math.PI / 180)
        context.drawImage(f.image, -w2, -h2)
        context.restore()
    }
}

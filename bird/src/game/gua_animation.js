class GuaAnimation extends New {
    constructor(game, animations, initial) {
        super()
        this.game = game
        this.x = 0
        this.y = 0
        this.frame = null
        this.frameInterval = 3
        this.frameCount = 0
        this.frameIndex = 0
        this.animations = animations
        this.currentAnimation = []
        this.animationPaused = false

        this.changeAnimation(initial)
    }

    changeAnimation(name) {
        this.frameIndex = 0
        this.frameCount = 0
        this.currentAnimation = this.animations[name]
    }

    update() {
        this.frame = this.currentAnimation[this.frameIndex]
        this.frame.x = this.x
        this.frame.y = this.y
        this.w = this.frame.w
        this.h = this.frame.h

        if (!this.animationPaused) {
            this.frameCount += 1
            if (this.frameCount > this.frameInterval) {
                this.frameCount = 0
                this.frameIndex = circleIndex(this.currentAnimation, this.frameIndex + 1)
            }
        }
    }

    stopAnimate() {
        this.animationPaused = true
    }

    draw() {
        this.frame.draw()
    }
}
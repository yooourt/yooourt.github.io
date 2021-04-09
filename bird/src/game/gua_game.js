class GuaGame {
    static instance(...args) {
        if (isNil(this.i)) {
            this.i = new this(...args)
        }
        return this.i
    }

    constructor({ fps, images, callback, debugEnabled }) {
        let canvas = e('#game-canvas')
        let context = canvas.getContext('2d')

        this.paused = false
        this.fps = fps
        this.imgs = images
        this.callback = callback
        this.canvas = canvas
        this.context = context
        this.keydowns = {}
        this.actions = {}
        this.images = {}
        this.scene = GuaScene.new()
        this.debugEnabled = debugEnabled
    }

    replaceScene(scene) {
        this.scene = scene
    }

    imageByName(name) {
        return this.images[name]
    }

    handleEvents() {
        window.addEventListener('keydown', (event) => {
            this.keydowns[event.key] = true
        })

        window.addEventListener('keyup', (event) => {
            this.keydowns[event.key] = false
        })
    }

    handleGameEvents() {
        Object.keys(this.keydowns).forEach(k => {
            if (this.keydowns[k]) {
                defaultTo(this.actions[k], () => {})()
            }
        })
    }

    drawImage(img) {
        this.context.drawImage(img.image, img.x, img.y)
    }

    registerAction(key, callback) {
        this.actions[key] = callback
        return () => this.actions[key] = null
    }

    clearCanvas() {
        let { context, canvas } = this
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    runLoop() {
        const loop = () => {
            if (this.debugEnabled) {
                this.fps = config.control.fps.value
                this.paused = config.control.paused.value == 1
            }

            if (!this.paused) {
                this.handleGameEvents()

                this.scene.update()

                this.clearCanvas()

                this.scene.draw()
            }

            setTimeout(loop, 1000 / this.fps)
        }

        loop()
    }

    preloadImages() {
        let ps = Object.entries(this.imgs).map(([name, path]) => {
            return loadImg(path).then(img => {
                this.images[name] = img
            })
        })
        return Promise.all(ps)
    }

    start() {
        this.handleEvents()
        this.preloadImages().then(() => {
            this.callback()
            this.runLoop()
        })
    }
}
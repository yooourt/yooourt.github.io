class GuaScene extends New {
    constructor(game) {
        super()
        this.game = game
        this.elements = []
        this.callbacks = DefaultMap.new(() => [])
        this.debugModeEnabled = config.debugEnabled
    }

    addElements(elements) {
        for (const e of elements) {
            this.addElement(e)
        }
    }

    addElement(element) {
        this.elements.push(element)
    }

    removeElement(element) {
        let i = this.elements.indexOf(element)
        if (i > -1) {
            this.elements.splice(i, 1)
        }
    }

    draw() {
        for (let e of this.elements) {
            e.draw()
        }
    }

    update() {
        if (this.debugModeEnabled) {
            for (let e of this.elements) {
                e.debug && e.debug()
            }
            this.debug && this.debug()
        }

        for (let e of this.elements) {
            e.update()
        }
    }

    trigger(event, data) {
        this.callbacks.get(event).forEach((callback) => {
            callback(data)
        })
    }

    listen(event, callback) {
        this.callbacks.get(event).push(callback)
    }

    // destroy() {
    //     this.callbacks = DefaultMap.new(() => [])
    // }
}

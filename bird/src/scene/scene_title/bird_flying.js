class CRange extends New {
    constructor(min, max, current) {
        super()

        this.a = []
        for (let i = min; i <= max; i += 1) {
            this.a.push(i)
        }
        this.i = this.a.findIndex(x => x === current)
    }

    next() {
        this.i = circleIndex(this.a, this.i + 1)
    }

    get value() {
        return this.a[this.i]
    }
}

class BirdFlying extends Bird {
    constructor(game) {
        super(game)

        this.rockCount = CRange.new(-15, 15, 0)
    }

    update() {
        super.update()

        let v = this.rockCount.value
        if (v > 0) {
            this.y += 2
        } else if (v < 0) {
            this.y -= 2
        }
        this.rockCount.next()
    }
}
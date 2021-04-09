const log = console.log.bind(console)

const e = document.querySelector.bind(document)

const es = document.querySelectorAll.bind(document)

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

const last = (array) => {
    return array[array.length - 1]
}

const isNil = (value) => {
    return [null, undefined].includes(value)
}

const defaultTo = (value, defaultValue) => {
    if (isNil(value)) {
        return defaultValue
    } else {
        return value
    }
}

const circleIndex = (array, index) => {
    let s = array.length
    let i = index % s
    if (i < 0) {
        i += s
    }
    return i
}

const circle = (array, index) => {
    let i = circleIndex(array, index)
    return array[i]
}

const loadImg = (path) => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
            resolve(img)
        }
        img.onerror = reject
    })
}

const pixelRatio = () => {
    let ctx = document.createElement('canvas').getContext('2d')
    let dpr = window.devicePixelRatio || 1
    let bsr = (
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1
    )
    return dpr / bsr;
}

const createCanvas = (w, h, ratio) => {
    if (isNil(ratio)) {
        ratio = pixelRatio()
    }
    let canvas = document.createElement('canvas')
    canvas.width = w * ratio
    canvas.height = h * ratio
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
    return canvas
}

const collided = (rect1, rect2) => {
    let a = rect1
    let b = rect2
    let r = (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    )
    return r
}
class New {
    static new(...args) {
        return new this(...args)
    }
}

class DefaultMap extends New {
    constructor(defaultValue) {
        super()
        this.m = new Map()
        this.d = defaultValue
    }

    set(key, value) {
        this.m.set(key, value)
    }

    get(key) {
        const value = this.m.get(key)

        if (isNil(value)) {
            this.set(key, this.d())
            return this.get(key)
        } else {
            return value
        }
    }
}

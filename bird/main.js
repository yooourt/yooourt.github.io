const mountCanvas = () => {
    let canvas = createCanvas(480, 640)
    // let canvas = createCanvas(680, 640)
    canvas.id = 'game-canvas'
    e('#canvas-wrapper').appendChild(canvas)
}

const __main = () => {
    mountCanvas()

    let debugEnabled = config.debugEnabled

    insertDebugControls(debugEnabled)

    let game = GuaGame.instance({
        debugEnabled,
        fps: 30,
        images: {
            bg: 'img/bg_day.png',
            ground: 'img/ground.png',
            pipe: 'img/pipe.png',
            bird_0: 'img/bird_s1.png',
            bird_1: 'img/bird_s2.png',
            bird_2: 'img/bird_s3.png',
            get_ready: 'img/get_ready.png',
            game_over: 'img/game_over.png',
            press_j: 'img/press_j_to_start.png',
            number0: 'img/number/number0.jpg',
            number1: 'img/number/number1.jpg',
            number2: 'img/number/number2.jpg',
            number3: 'img/number/number3.jpg',
            number4: 'img/number/number4.jpg',
            number5: 'img/number/number5.jpg',
            number6: 'img/number/number6.jpg',
            number7: 'img/number/number7.jpg',
            number8: 'img/number/number8.jpg',
            number9: 'img/number/number9.jpg',
        },
        callback: () => {
            let s = SceneTitle.new(game)
            game.replaceScene(s)
        }
    })

    game.start()
}

__main()

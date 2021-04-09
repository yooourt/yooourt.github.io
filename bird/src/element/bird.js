class Bird extends GuaAnimation {
    constructor(game) {
        let animations = {
            flys: [],
        }

        for (let i = 0; i < 3; i += 1) {
            let b = GuaImage.new(game, 'bird_' + i)
            animations.flys.push(b)
        }

        super(game, animations, 'flys')
    }
}

const insertDebugControls = (enable) => {
    if (!enable) {
        return
    }

    const bindAll = function(sel, eventName, callback) {
        let a = es(sel)

        for (var i = 0; i < a.length; i += 1) {
            var input = a[i]
            input.addEventListener(eventName, function(event) {
                callback(event)
            })
        }
    }

    const templateControl = function(key, item) {
        let t = `
            <div class="gua-controls">
                <label>
                    <input
                        class="gua-auto-slider"
                        type="range"
                        min="${item.min}"
                        max="${item.max}"
                        value="${item.value}"
                        data-value="config.control.${key}"
                    />
                    ${item._comment}:
                    <span class="gua-label">${item.value}</span>
                </label>
            </div>
        `
        return t
    }

    const insertControls = function() {
        let div = e('.gua-controls')
        let keys = Object.keys(config.control)
        for (let k of keys) {
            let item = config.control[k]
            let html = templateControl(k, item)
            div.insertAdjacentHTML('beforeend', html)
        }
    }

    const bindEvents = function() {
        bindAll('.gua-auto-slider', 'input', function(event) {
            let target = event.target
            let bindVar = target.dataset.value
            let v = target.value
            eval(bindVar + '.value=' + v)
            let label = target.closest('label').querySelector('.gua-label')
            label.innerText = v
        })
    }

    insertControls()
    bindEvents()
}
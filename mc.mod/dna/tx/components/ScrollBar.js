const Panel = require('/mod/mc/dna/tx/components/Panel')

let id = 0
class ScrollBar extends Panel {

    constructor(st) {
        super( augment({
            name: 'scrollBar' + (++id),
            cur:  .5,
            fill: .25,
        }, st) )
    }

    adjust() {
        const txt = this.tx
        this.y = 0
        this.w = 1
        this.h = txt.th
    }

    scrollUp() {
        this.cur = max(this.cur - .1, 0)
    }

    scrollDown() {
        this.cur = min(this.cur + .1, 1 - this.fill)
    }

    sync() {}

    draw() {
        this.sync()
        const txt = this.tx
        const { x, y, w, h, cur, fill } = this

        const y1 = floor(cur * h)
        const h1 = ceil(fill * h)
        const y2 = min(y1 + h1, h)

        this.background()

        txt.back(lib.cidx('base'))
           .face(lib.cidx('alert'))
        for (let i = 0; i < h; i++) {
            txt.at(x, y + i).out(' ')
        }

        txt.back(lib.cidx('alert'))
           .face(lib.cidx('base'))
        for (let i = y1; i < y2; i++) {
            txt.at(x, y + i).out(' ')
        }
    }

    onMouseDown(tx, ty, b, e) {
        const { x, y, w, h, cur, fill } = this

        const y1 = floor(cur * h)
        const h1 = ceil(fill * h)
        const y2 = min(y1 + h1, h)

        if (ty <= y1) this.scrollUp()
        else if (ty >= y2) this.scrollDown()
    }

    onMouseWheel(delta, tx, ty, e) {
        if (delta > 0) this.scrollUp()
        else if (delta < 0) this.scrollDown()
    }
}

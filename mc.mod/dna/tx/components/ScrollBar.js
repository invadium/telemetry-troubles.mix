const Panel = require('/mod/mc/dna/tx/components/Panel')

class ScrollBar extends Panel {

    constructor(st) {
        super( augment({
            name: 'scrollBar' + id('textScrollBar'),
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
        this.sync()
    }

    scrollDown() {
        this.cur = min(this.cur + .1, 1 - this.fill)
        this.sync()
    }

    scrollTo(relativePos) {
        this.cur = clamp(relativePos, 0, 1)
        this.sync()
    }

    pageUp() {
        this.cur = max(this.cur - this.fill, 0)
        this.sync()
    }

    pageDown() {
        this.cur = min(this.cur + this.fill, 1 - this.fill)
        this.sync()
    }

    sync() {}

    draw() {
        this.sync()
        const txt = this.tx
        const { x, y, w, h, cur, fill } = this

        const y1 = floor(clamp(cur, 0, 1) * h)
        const h1 = ceil(fill * h)
        const y2 = min(y1 + h1, h)

        this.background()

        txt.back(cidx.base)
           .face(cidx.alert)
        for (let i = 0; i < h; i++) {
            txt.at(x, y + i).out(' ')
        }

        txt.back(cidx.alert)
           .face(cidx.base)
        for (let i = y1; i < y2; i++) {
            txt.at(x, y + i).out(' ')
        }
    }

    onMouseDown(tx, ty, b, e) {
        const { x, y, w, h, cur, fill } = this

        if (e.buttons & 1) {
            this.scrollTo( ty / h )
        } else if (e.buttons & 2) {
            const y1 = floor(cur * h)
            const h1 = ceil(fill * h)
            const y2 = min(y1 + h1, h)

            if (ty <= y1) this.pageUp()
            else if (ty >= y2) this.pageDown()
        }
    }

    onMouseWheel(delta, tx, ty, e) {
        if (delta > 0) this.scrollUp()
        else if (delta < 0) this.scrollDown()
    }
}

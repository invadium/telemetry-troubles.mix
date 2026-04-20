let id = 0
class Panel {

    constructor(st) {
        augment(this, {
            name: 'panel' + (++id),
            x:     0,
            y:     0,
            w:     0,
            h:     0,
        }, st)
    }

    adjust() {
        const txt = this.tx
        this.x = 0
        this.y = 0
        this.w = txt.tw
        this.h = txt.th
    }

    hide() {
        this.hidden = true
        this.__.adjust()
    }

    show() {
        this.hidden = false
        this.__.adjust()
    }

    background() {
        const txt = this.__
        const bx  = this.x
        const by  = this.y
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                txt.put(bx+x, by+y, ' ')
                txt.put(bx+x, by+y, 0, dry.FACE)
                txt.put(bx+x, by+y, 0, dry.BACK)
            }
        }
    }

    centerText(label, x, y) {
        const txt = this.tx,
              len = label.length,
              dx  = floor(.5 * len),
              bx  = floor(x - dx)
        y = floor(y)

        for (let i = 0; i < len; i++) {
            // txt.put(bx + i, y, label.charAt(i))
            txt.at(bx + i, y)
               .out(label.charAt(i))
        }
    }

    clipText(label, x, y, clipWidth) {
        const txt = this.tx,
              len = label.length,
              LEN = min(len, clipWidth),
              bx  = x | 0,
              by  = y | 0

        for (let i = 0; i < LEN; i++) {
            // txt.put(bx + i, by, label.charAt(i))
            txt.at(bx + i, by)
               .out(label.charAt(i))
        }
        for (let i = LEN; i < clipWidth; i++) {
            txt.at(bx + i, by)
               .out(' ')
        }
    }

    hseparator(x, y, w, c) {
        const txt = this.tx,
              ch  = c || '-'

        for (let i = 0; i < w; i++) {
            txt.at(x + i, y).out(ch)
        }
    }

    vseparator(x, y, h, c) {
        const txt = this.tx,
              ch  = c || '|'

        for (let i = 0; i < h; i++) {
            txt.at(x, y + i).out(ch)
        }
    }

    rect(x, y, w, h, hc, vc, ec) {
        const txt = this.tx,
              ech = ec || '+'

        this.hseparator(x + 1, y,         w - 2, hc)
        this.hseparator(x + 1, y + h - 1, w - 2, hc)
        this.vseparator(x,         y + 1, h - 2, vc)
        this.vseparator(x + w - 1, y + 1, h - 2, vc)

        txt.at(x,         y,       ).out(ech)
        txt.at(x + w - 1, y,       ).out(ech)
        txt.at(x + w - 1, y + h - 1).out(ech)
        txt.at(x,         y + h - 1).out(ech)
    }

    onMouseUp(tx, ty, b, e) {
        // log(`mouse #${e.button + 1} up: ${tx}:${ty}`)
    }

    onMouseMove(tx, ty, e) {
        // log(`mouse move: ${tx}:${ty}`)
    }

    onMouseEnter() {
        // log('menu: the mouse is in!')
    }

    onMouseExit() {
        // log('menu: the mouse is out!')
    }

    draw() {
        this.background()
    }
}

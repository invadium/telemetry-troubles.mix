const Panel = require('/mod/mc/dna/tx/components/Panel')

let id = 0
class TextButton extends Panel {

    constructor(st) {
        super( augment({
            name: 'button' + (++id),
            label: 'Button ' + id,
            align: 'center',
            FILLER: ' ',

            _hover: false,
        }, st) )
    }

    adjust() {
        const txt = this.tx
        this.x = 0
        this.y = 0
        this.w = txt.tw
        this.h = 1
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, label, align, _hover } = this
        this.background()

        if (_hover) {
            txt.back(lib.cidx('alert'))
               .face(lib.cidx('baseHi'))
        } else {
            txt.back(lib.cidx('baseHi'))
               .face(lib.cidx('alert'))
        }

        this.hseparator(x, y, w, this.FILLER)
        if (align === 'left') {
            this.clipText(label, x, y, w)
        } else {
            this.centerText(label, x + .5 * w, y)
        }
    }

    onPress() {}

    onMouseDown(tx, ty, b, e) {
        // log(`mouse #${e.button + 1} down: ${tx}:${ty}`)
        this.onPress(tx, ty)
    }

    onMouseEnter() {
        this._hover = true
    }

    onMouseExit() {
        this._hover = false
    }
}

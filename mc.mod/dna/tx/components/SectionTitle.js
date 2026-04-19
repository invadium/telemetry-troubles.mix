const Panel = require('/mod/mc/dna/tx/components/Panel')

let id = 0
class SectionTitle extends Panel {

    constructor(st) {
        super( augment({
            name: 'title' + (++id),
            label: '',
        }, st) )
    }

    adjust() {
        const txt = this.tx
        this.x = 0
        this.w = txt.tw
        this.h = 1
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, label } = this
        this.background()

        // === title ===
        txt.back(lib.cidx('alert'))
           .face(lib.cidx('base'))

        this.hseparator(x, y, w, '=')
        this.centerText(label, x + .5 * w, y)
    }
}

const Panel = require('/mod/mc/dna/tx/components/Panel')

let id = 0
class SectionTitle extends Panel {

    constructor(st) {
        super( augment({
            name: 'title' + (++id),
            FILLER: '=',
            label: '',
            align: 'center',
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
        const { x, y, w, h, label, align } = this
        this.background()

        // === title ===
        txt.back(lib.cidx('title'))
           .face(lib.cidx('base'))

        this.hseparator(x, y, w, this.FILLER)
        
        if (align === 'left') {
            this.clipText(label, x, y, w)
        } else {
            this.centerText(label, x + .5 * w, y)
        }
    }
}

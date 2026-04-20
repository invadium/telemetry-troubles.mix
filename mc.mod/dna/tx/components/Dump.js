const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class Dump extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name:  'dump',

            core: {
                capacity: 128,
                mem: []
            },
        }, st) )

        for (let i = 0; i < 64; i++) {
            this.core.mem[i] = rnd() < .5? 'ADD' : 5
        }
    }

    contentLength() {
        return this.core.capacity
    }

    open(at) {
        const core = this.core,
              mem  = core.mem

        log('#' + at + ': ' + mem[at])
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, stackPointer, core } = this

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w1 = 6,
              x2 = x1 + w1 + 1,
              w2 = 6

        txt.back(lib.cidx('base'))
           .face(lib.cidx('alert'))

        // === column titles ===
        this.clipText('Offset', x1, by, w1)
        this.clipText('Opcode', x2, by, w2)
        txt.at(x1 + w1, by).out('|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + 1)

        // dump
        by++
        let selectionPos = 0
        const mem = core.mem
        for (let i = stackPointer; i < core.capacity; i++, by++, selectionPos++) {
            const opcode = mem[i] ?? '....',
                  selected = (selectionPos === this.selection)
            
            if (selected) {
                txt.back(lib.cidx('alert'))
                   .face(lib.cidx('base'))
                // subject = `[${subject}]`
            } else {
                txt.back(lib.cidx('base'))
                   .face(lib.cidx('alert'))
            }

            this.clipText('' + i,      x1, by, w1)
            this.clipText('' + opcode, x2, by, w2)
            txt.at(x1 + w1, by).out('|')
        }
        if (by < y+h-1) {
            this.hseparator(x1, by, w1 + w2 + 1)
        }
    }

}

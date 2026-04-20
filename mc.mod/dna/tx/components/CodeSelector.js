const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class CodeSelector extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name: 'codeSelector',

            // TODO move out to a separate Ops catalog
            options: [
                '....',
                'push',
                'pop',
                'drop',
                'swap',
                'add',
                'sub',
            ]
        }, st) )

        for (let i = 0; i < 64; i++) {
            this.options.push(i)
        }
    }

    contentLength() {
        return this.options.length
    }

    open(at) {
        // TODO sync the selection with the core target
        log('cell set to: ' + this.options[at])
    }

    exit() {
        // TODO any actions here?
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, options, stackPointer, core } = this

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w1 = 4

        txt.back(lib.cidx('base'))
           .face(lib.cidx('alert'))

        // === column titles ===
        this.clipText('CODE', x1, by, w1)

        // content separator
        by++
        this.hseparator(x1, by, w1)

        // dump
        by++
        let selectionPos = 0
        for (let i = stackPointer; i < options.length && by < y + h; i++, by++, selectionPos++) {
            const opcode   = options[i],
                  selected = (selectionPos === this.selection)

            if (selected) {
                txt.back(lib.cidx('pick'))
                   .face(lib.cidx('base'))
            } else {
                // regular text
                txt.back(lib.cidx('base'))
                   .face(lib.cidx('alert'))
            }

            this.clipText(lib.format.toCodeString(opcode, w1), x1, by, w1)
        }
    }

    dump() {
        return 'selection: ' + this.selection + ' sp: ' + this.stackPointer
    }

}

const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class CodeSelector extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name: 'codeSelector',

            codePointer: -1,

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

        const options = this.options
        options.forEach((o, i) => {
            options[i] = o.toUpperCase()
        })
        for (let i = 0; i < 64; i++) {
            options.push(i)
        }
        options.codeToIndex = function(code) {
            if (isStr(code)) return this.indexOf(code.toUpperCase())
            if (isNum(code)) return this.indexOf(code)
            return 0
        }
    }

    contentLength() {
        if (this.codePointer < 0) return 0
        return this.options.length
    }

    open(at) {
        const { options, dump } = this
        const mnemonics = options[at]
        const newCode = mnemonics === '....'? null : mnemonics
        // log(`@${dump.editPoint()}: #${at}::${lib.format.toCodeString(newCode)}`)
        dump.setCode(newCode)
    }

    exit() {
        // TODO any actions here?
    }

    sync() {
        const dump = this.dump,
              core = dump.core,
              options = this.options

        const EP = dump.editPoint()
        if (EP < 0) {
            this.codePointer = -1
            return
        }
        const code = core.mem[EP]
        this.codePointer = options.codeToIndex(code)
    }

    syncView() {
        this.sync()
        const { stackPointer, codePointer } = this
        const screenCapacity = this.screenCapacity()

        if (codePointer < stackPointer || codePointer >= stackPointer + screenCapacity) {
            this.stackPointer = codePointer
        }
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, options, stackPointer, codePointer, dump } = this
        this.sync()

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w1 = 1,
              x2 = x1 + w1,
              w2 = 4

        txt.back(lib.cidx('base'))
           .face(lib.cidx('default'))

        // === column titles ===
        this.clipText('CODE', x2, by, w2)
        this.vseparator(x1, by, h)

        if (codePointer < 0) {
            txt.back(lib.cidx('base'))
               .face(lib.cidx('default'))
            while(by < y + h) {
                by ++
                this.clipText('....', x2, by, w2)
            }
            return
        }

        // content separator
        by++
        this.hseparator(x2, by, w2)

        // dump
        by++
        let selectionPos = 0
        for (let i = stackPointer; i < options.length && by < y + h; i++, by++, selectionPos++) {
            const opcode   = options[i],
                  selected = (selectionPos === this.selection),
                  focused  = (i === codePointer)

            if (focused) {
                txt.back(lib.cidx('focus'))
                   .face(lib.cidx('base'))
            } else if (selected) {
                txt.back(lib.cidx('pick'))
                   .face(lib.cidx('base'))
            } else {
                // regular text
                txt.back(lib.cidx('base'))
                   .face(lib.cidx('default'))
            }

            this.clipText(lib.format.toCodeString(opcode, w2), x2, by, w2)
        }
    }

    dump() {
        return 'selection: ' + this.selection + ' sp: ' + this.stackPointer
    }

}

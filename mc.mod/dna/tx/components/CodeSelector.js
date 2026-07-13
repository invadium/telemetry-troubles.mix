const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class CodeSelector extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name: 'codeSelector',

            codePointer:        -1,
            prevSelectedOption: -1,

            options: [
                '....',
            ]
        }, st) )

        const options = this.options
        options.forEach((o, i) => {
            options[i] = o.toUpperCase()
        })
        for (let i = 0; i < env.tune.selectorNumbers; i++) {
            options.push(i)
        }
        options.codeToIndex = function(code) {
            if (isStr(code)) return this.indexOf(code.toUpperCase())
            if (isNum(code)) return this.indexOf(code)
            return 0
        }
    }

    isLocked(code) {
        if (!code) return true
        code = code.toUpperCase()

        if (this.options.indexOf(code) >= 0) return false
        else return true
    }

    unlock(code) {
        if (!code) return
        code = code.toUpperCase()
        if (this.options.indexOf(code) >= 0) return // already unlocked!
        // TODO check if the instruction exists in DUSTY-12

        this.options.splice(1, 0, code)
    }

    contentLength() {
        if (this.codePointer < 0) return 0
        return this.options.length
    }

    open(at, tx, ty, e) {
        const { options, coreMonitor } = this
        const mnemonics = options[at]
        const newCode = mnemonics === '....'? null : mnemonics
        // log(`@${coreMonitor.editPoint()}: #${at}::${lib.format.toCodeString(newCode)}`)
        coreMonitor.setCode(newCode)

        if (e.buttons & 2) {
            coreMonitor.shiftForward()
            sfx('code-place')
        } else {
            sfx('code-pick')
        }
        coreMonitor.syncEditInView()
    }

    exit() {
        // TODO any actions here?
    }

    sync() {
        const coreMonitor = this.coreMonitor,
              capsule = coreMonitor.capsule,
              options = this.options

        const EP = coreMonitor.editPoint()
        if (EP < 0) {
            this.codePointer = -1
            return
        }
        const code = capsule[EP]
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
        const { x, y, w, h, options, stackPointer, codePointer, coreMonitor } = this
        this.sync()

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w1 = 1,
              x2 = x1 + w1,
              w2 = 4

        txt.back(cidx.base)
           .face(cidx.default)

        // === column titles ===
        this.clipText('CODE', x2, by, w2)
        this.vseparator(x1, by, h)

        if (codePointer < 0) {
            txt.back(cidx.base)
               .face(cidx.default)
            while(by < y + h) {
                by ++
                this.clipText('....', x2, by, w2)
            }
            return
        }

        // content separator
        by++
        this.hseparator(x2, by, w2)

        // coreMonitor
        by++
        let selectionPos = 0
        for (let i = stackPointer; i < options.length && by < y + h; i++, by++, selectionPos++) {
            const opcode   = options[i],
                  selected = (selectionPos === this.selection),
                  focused  = (i === codePointer)

            if (focused) {
                txt.back(cidx.focus)
                   .face(cidx.base)
            } else if (selected) {
                txt.back(cidx.pick)
                   .face(cidx.base)
            } else {
                // regular text
                txt.back(cidx.base)
                   .face(cidx.default)
            }

            this.clipText(lib.format.toCodeString(opcode, w2), x2, by, w2)
        }
    }

    dump() {
        return 'selection: ' + this.selection + ' sp: ' + this.stackPointer
    }

    onSelect(tx, ty, e, prevSelection) {
        const dusty = this.coreMonitor.dusty
        const at = this.stackPointer + this.selection

        if (at !== this.prevSelectedOption
                && this.selection >= 0
                && this.selection < this.contentLength()) {

            const mnemonic = this.options[at]
            if (isStr(mnemonic)) {
                const op = dusty.mnemonics[ mnemonic ]
                if (op) {
                    if (op.effect) {
                        this.status = `(${op.effect}) ${op.info}`
                    } else {
                        this.status = op.info
                    }
                }
            } else {
                this.status = `push [${mnemonic}] on the data stack`
            }

            this.prevSelectedOption = at

            tsfx('code-selected', .1)
        }
        if (this.selection < 0 || this.selection > this.contentLength()) {
            // TODO current code point?
            this.prevSelectedOption = -1
            this.status = ''
        }
    }
}

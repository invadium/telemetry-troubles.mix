const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

const VIEW_MODE = 1
const EDIT_MODE = 2
const EXEC_MODE = 3

class CoreMonitor extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name:  'coreMonitor',
            mode: VIEW_MODE, // TODO look at Dusty12 for the current mode

            dusty: null,

            editPointer: -1,
        }, st) )

        /*
        for (let i = 0; i < 64; i++) {
            this.capsule[i] = rnd() < .5? 'ADD' : RND(0, 32)
        }
        */
    }

    adjust() {
        // TODO adjust to leave the space for control buttons
        if (this.port) {
            this.x = this.port.x
            this.y = this.port.y
            this.w = this.port.w
            this.h = this.port.h
        } else {
            const m = this.margins
            this.x = m.east
            this.y = m.north
            // this.w = this.__.tw - m.east - m.west
            this.w = 8
            this.h = this.__.th - m.north - m.south
        }
    }

    contentLength() {
        return this.capsule.capacity
    }

    bind(dusty) {
        this.dusty = dusty
        dusty.registerMonitor(this)
        this.selectCapsule(0)
    }

    selectCapsule(icapsule) {
        this.capsule = this.dusty.capsule(icapsule)
    }

    edit(at) {
        this.editPointer = at
        trap('edit')
    }

    editPoint() {
        if (this.mode !== EDIT_MODE) return -1
        return this.editPointer
    }

    setCode(code) {
        if (this.mode !== EDIT_MODE || this.editPointer < 0) return -1
        this.capsule[this.editPointer] = code
    }

    resetCapsule() {
        this.dusty.spy.formatCapsule()
    }

    flush(src) {
        this.dusty.flush(src)
    }

    shiftForward() {
        if (this.mode !== EDIT_MODE) return
        if (this.editPointer < this.contentLength() - 1) {
            this.editPointer ++
        }
    }

    open(at, e) {
        const capsule = this.capsule

        switch(this.mode) {
            case VIEW_MODE:
                this.mode = EDIT_MODE
                this.edit(at)
                break
            case EDIT_MODE:
                this.edit(at)
                break
        }
        // log('#' + lib.format.toHexString(at, 3) + ': ' + lib.format.toCodeString(capsule[at], 4))
        sfx('cell-pick')
    }

    exit() {
        if (this.mode === EDIT_MODE) {
            this.mode = VIEW_MODE
            this.edit(-1)
        }
    }

    step() {
        this.mode = EXEC_MODE
        this.dusty.step()
    }

    walk() {
        this.mode = EXEC_MODE
        // this.dusty.upload()
        this.dusty.walk()
        sfx('dusty-step')
    }

    run() {
        this.mode = EXEC_MODE
        // this.dusty.op('RST')
        this.dusty.run()
    }

    suspend() {
        this.dusty.suspend()
    }

    stop() {
        this.dusty.halt()
        this.dusty.op('RST')
    }

    /*
    exec() {
        const core = this.core
        this.mode = EXEC_MODE
        core.cp = 0
        core.timer = env.time
    }

    halt() {
        const core = this.core
        this.mode = VIEW_MODE
        core.cp = -1
        core.time = 0
    }
    */

    syncExecInView() {
        const { stackPointer, core } = this
        const cp = core.cp
        const screenCapacity = this.screenCapacity()

        if (cp < stackPointer || cp >= stackPointer + screenCapacity) {
            this.stackPointer = cp
        }
    }

    evo() {}

    draw() {
        const txt = this.tx
        const { x, y, w, h, mode, stackPointer, editPointer, dusty, capsule } = this
        const MODE = dusty.spy.MODE(),
              PC   = dusty.spy.PC(),
              CAP  = dusty.spy.CAP()

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w1 = 3,
              x2 = x1 + w1 + 1,
              w2 = 4

        txt.back(cidx.base)
           .face(cidx.default)

        // === column titles ===
        this.clipText('ADR', x1, by, w1)
        this.clipText(' OPS', x2, by, w2)
        txt.at(x1 + w1, by).out('|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + 1)

        // dump the memory snapshot
        by++
        let selectionPos = 0
        for (let i = stackPointer; i < capsule.capacity && by < y + h; i++, by++, selectionPos++) {
            const opcode = capsule[i],
                  executed = (MODE >= dusty.STEP && i === PC),
                  edited   = (mode === EDIT_MODE && i === editPointer),
                  selected = (selectionPos === this.selection)

            if (executed) {
                txt.back(cidx.apply)
                   .face(cidx.base)
            } else if (edited) {
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
            this.clipText(lib.format.toHexString(i, w1), x1, by, w1)
            this.clipText(lib.format.toCodeString(opcode, w2), x2, by, w2)
            txt.at(x1 + w1, by).out('|')
        }
        /*
        if (by < y+h-1) {
            this.hseparator(x1, by, w1 + w2 + 1)
        }
        */
    }

    onSelect(tx, ty, e, prevSelection) {
        if (this.selection !== prevSelection
                && this.selection >= 0
                && this.selection < this.contentLength()) {
            tsfx('cell-selected', .1)
        }
    }

    onFocus() {
        // log('core monitor is in focus!')
    }

    onUnfocus() {
        // log('core monitor has lost focus!')
    }

    onKeyDown(e) {
        log(e.code)
    }

    onFlush(e) {
        const codeSelector = this.__.codeSelector
        const ops = e.ops.filter(e => isString(e))
        for (let i = ops.length - 1; i >= 0; i--) {
            codeSelector.unlock(ops[i])
        }
    }

    onStep() {
        sfx('dusty-step')
    }

    onHalt() {
        this.mode = EDIT_MODE
        sfx('dusty-halt')
    }

}

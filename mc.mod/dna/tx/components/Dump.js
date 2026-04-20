const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

const VIEW_MODE = 1
const EDIT_MODE = 2
const EXEC_MODE = 3

class Dump extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name:  'dump',
            mode: VIEW_MODE,

            // TODO move out to a separate Core entity
            core: {
                capacity: 128,
                mem: [],
                cp:   -1,
                timer: 0,
            },

            editPointer: -1,
            execPointer: -1,
        }, st) )

        for (let i = 0; i < 64; i++) {
            this.core.mem[i] = rnd() < .5? 'ADD' : 5
        }
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
        return this.core.capacity
    }

    open(at) {
        const core = this.core,
              mem  = core.mem

        switch(this.mode) {
            case VIEW_MODE:
                this.mode = EDIT_MODE
                this.editPointer = at
                break
            case EDIT_MODE:
                this.editPointer = at
                break
        }
        log('#' + lib.format.toHexString(at, 3) + ': ' + lib.format.toCodeString(mem[at], 4))
    }

    exit() {
        if (this.mode === EDIT_MODE) {
            this.mode = VIEW_MODE
            this.editPointer = -1
        }
    }

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

    syncExecInView() {
        const { stackPointer, core } = this
        const cp = core.cp
        const screenCapacity = this.screenCapacity()

        if (cp < stackPointer || cp >= stackPointer + screenCapacity) {
            this.stackPointer = cp
        }
    }

    evo(dt) {
        // TODO move out to emu system
        
        // emulate execution here
        if (this.mode !== EXEC_MODE) return
        const core = this.core
        const EXEC_SPEED = .25
        if (core.timer + EXEC_SPEED < env.time) {
            // next step
            core.timer = env.time
            core.cp ++
            if (core.cp >= core.mem.length) this.halt()
            else this.syncExecInView()
        }
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, mode, stackPointer, editPointer, core } = this

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w1 = 3,
              x2 = x1 + w1 + 1,
              w2 = 4

        txt.back(lib.cidx('base'))
           .face(lib.cidx('alert'))

        // === column titles ===
        this.clipText('ADR', x1, by, w1)
        this.clipText('CODE', x2, by, w2)
        txt.at(x1 + w1, by).out('|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + 1)

        // dump
        by++
        let selectionPos = 0
        const mem = core.mem
        for (let i = stackPointer; i < core.capacity && by < y + h; i++, by++, selectionPos++) {
            const opcode = mem[i],
                  executed = (mode === EXEC_MODE && i === core.cp),
                  edited   = (mode === EDIT_MODE && i === editPointer),
                  selected = (selectionPos === this.selection)

            if (executed) {
                txt.back(lib.cidx('apply'))
                   .face(lib.cidx('base'))
            } else if (edited) {
                txt.back(lib.cidx('focus'))
                   .face(lib.cidx('base'))
            } else if (selected) {
                txt.back(lib.cidx('pick'))
                   .face(lib.cidx('base'))
            } else {
                // regular text
                txt.back(lib.cidx('base'))
                   .face(lib.cidx('alert'))
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

}

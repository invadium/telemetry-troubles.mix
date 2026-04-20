const Panel = require('/mod/mc/dna/tx/components/Panel')

let id = 0
class ScrollablePanel extends Panel {

    constructor(st) {
        super( augment({
            name:  'scrollablePanel' + (++id),

            x:      0,
            y:      0,
            w:      0,
            h:      0,

            header:        2,
            stackPointer:  0,
            selection:    -1,
            column:       -1,
            
            margins: {
                north: 1,
                east:  0,
                south: 0,
                west:  1,
            },
        }, st) )
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
            this.w = this.__.tw - m.east - m.west
            this.h = this.__.th - m.north - m.south
        }
    }

    lx(ux) {
        return ux - this.x
    }

    ly(uy) {
        return uy - this.y
    }

    gx(lx) {
        return lx + this.x
    }

    gy(ly) {
        return ly + this.y
    }

    contentLength() {
        throw new Error('not implemented')
    }

    relativePos() {
        return this.stackPointer / this.contentLength()
    }

    relativeFill() {
        const len = this.contentLength(),
              cap = this.contentCapacity()
        if (len < cap) return 1
        return cap/len
    }

    contentCapacity() {
        return this.h - this.header
    }

    selectionCapacity() {
        return this.h - this.header - 1
    }

    select(tx, ty) {
        const { x, y, w, h } = this
        if (tx < x || tx >= x + w || ty < this.header || ty >= y + h) {
            this.selection = -1
            this.column = -1
        } else {
            this.selection = ty - this.header
            this.column = tx
        }
    }

    clearSelection() {
        this.selection = -1
        this.column = -1
    }

    enter(tx, ty) {
        this.select(tx, ty)
        if (this.selection < 0) return

        // const pos = this.contentLength() - 1 - this.stackPointer - this.selection
        const pos = this.stackPointer + this.selection
        if (pos >= this.contentLength()) return

        this.open(pos)
    }

    open() {
        throw new Error('not implemented')
    }

    scrollUp() {
        if (this.stackPointer > 0) this.stackPointer --
    }

    scrollDown() {
        const __ = this,
              stackPointer = this.stackPointer
        if (stackPointer < __.contentLength() - __.selectionCapacity() - 1) __.stackPointer ++
    }

    onMouseDown(tx, ty, b, e) {
        // log(`mouse #${e.button + 1} down: ${tx}:${ty}`)
        this.enter(tx, ty)
    }

    onMouseUp(tx, ty, b, e) {
        // log(`mouse #${e.button + 1} up: ${tx}:${ty}`)
    }

    onMouseMove(tx, ty, e) {
        // log(`mouse move: ${tx}:${ty}`)
        this.select(tx, ty)
    }

    onMouseEnter() {
        // log('menu: the mouse is in!')
    }

    onMouseExit() {
        // log('menu: the mouse is out!')
        this.clearSelection()
    }

    onMouseWheel(delta, tx, ty, e) {
        if (delta > 0) this.scrollUp()
        else if (delta < 0) this.scrollDown()
    }

}

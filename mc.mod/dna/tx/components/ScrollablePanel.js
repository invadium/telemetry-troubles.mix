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
            
            margins: {
                north: 0,
                east:  0,
                south: 0,
                west:  1,
            },
        }), st)
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

}

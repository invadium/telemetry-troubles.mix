const Pod = require('/mod/mc/dna/ops/pod/Pod')

function nextSpeed() {
    return .1 + .1 * rnd()
}

class Spaceframe extends Pod {

    constructor(st) {
        super( augment({
            name: 'spaceframe',

            x:     50,
            y:     85,
            w:     55,
            h:     10,

            padding: 1,
            cellR:   2,
            cells:   []

        }, st) )
        this.powerOn()

        const PD = this.padding
        this.WG = floor((this.w - PD) / (this.cellR + PD))
        this.HG = floor((this.h - PD) / (this.cellR + PD))
        this.randomizeCells()
    }

    randomizeCells() {
        for (let y = 0; y < this.HG; y++) {
            for (let x = 0; x < this.WG; x++) {
                this.cells.push({
                    val:   rnd(),
                    speed: nextSpeed() * math.rnds(),
                })
            }
        }
    }

    powerOff() {
        // can't be powered off - always on!
    }

    evo(dt) {
        super.evo(dt)

        const cells = this.cells
        for (let i = cells.length - 1; i >= 0; i--) {
            const cell = cells[i]
            cell.val += cell.speed * dt
            if (cell.speed > 0) {
                if (cell.val >= 1) {
                    cell.val = 1
                    cell.speed *= -1
                }
            } else if (cell.speed < 0) {
                if (cell.val <= 0) {
                    cell.val = 0
                    cell.speed = nextSpeed()
                }
            }
        }
    }

    draw() {
        const { x, y, w, h, cells } = this

        save()
        translate(x - .5*w, y - .5*h)

        stroke(env.palette.main)
        rect( 0, 0, w, h )

        const R  = this.cellR,
              PD = this.padding,
              WG = this.WG,
              HG = this.HG

        fill(env.palette.main)
        for (let i = 0; i < HG; i++) {
            for (let j = 0; j < WG; j++) {
                const cell = cells[i * WG + j]
                alpha(cell.val)
                rect( j*(R+PD) + PD, i*(R+PD) + PD, R, R)
            }
        }

        restore()
    }

}

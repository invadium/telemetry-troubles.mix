class Blueprint extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name: 'blueprint',

            x: 0,
            y: 0,
            w: 0,
            h: 0,

            aspect: .85,

            margins: {
                north: 5,
                east:  60,
                south: 5,
                west:  40,
            },
        }, st) )
    }

    adjust() {
        const W = this.__.viewport.w,
              H = this.__.viewport.h,
              margins = this.margins,
              email = this.__.email,
              titleBar = this.__.titleBar,
              statusBar = this.__.statusBar

        const BX = email.x + email.w + margins.east
        const BY = titleBar.y + titleBar.h + margins.north
        const maxWidth = W - (BX + margins.west)
        const maxHeight = H - (BY + (H - statusBar.y) + margins.south)
        // base on target width first
        let tw = maxWidth
        let th = tw / this.aspect

        if (th > maxHeight) {
            // not fitting vertically!
            // Recalc based on max possible height
            th = maxHeight
            tw = th * this.aspect
        }
        const st = this.st = {
            W,
            H,
            BX,
            BY,
            maxWidth,
            maxHeight,
            tw,
            th,
        }

        //this.x = BX
        //this.y = BY
        this.x = BX + .5 * (maxWidth - tw)
        this.y = BY + .5 * (maxHeight - th)
        this.w = tw
        this.h = th
    }

    draw() {
        const { x, y, w, h } = this
        lineWidth(2)
        stroke(.4, .5, .6)
        rect(x, y, w, h)
        circle(x + .5*w, y + .5*h, .25*w)
    }

    dump() {
        const _ = this
        Object.keys(_.st).forEach(k => {
            const v = _.st[k]
            log(`${k}: ${v}`)
        })
        return 'OK'
    }
}


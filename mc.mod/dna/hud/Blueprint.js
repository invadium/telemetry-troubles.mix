// Probe status visualization screen
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

        this.x = BX + .5 * (maxWidth - tw)
        this.y = BY + .5 * (maxHeight - th)
        this.w = tw
        this.h = th
    }

    drawFrontal() {
        lineWidth(.5)
        circle(0, 0, 22)
        circle(0, 0, 5)

        save()
            translate(0, 20)
            rect(-5, 0, 10, 15)
            line(-1, 15, -1, 50)
            line( 1, 15,  1, 50)
        restore()

        save()
            rotate(-.12*TAU)
            lineWidth(.5)
            line(0, 5, 0, 22)
            rotate(.33*TAU)
            line(0, 5, 0, 22)
            rotate(.33*TAU)
            line(0, 5, 0, 22)
        restore()

        save()
            rotate(-.18*TAU)
            lineWidth(1)
            line(0, 22, 0, 50)
        restore()
        save()
            rotate(-.55*TAU)
            line(0, 22, 0, 52)
        restore()
        save()
            rotate(-.73*TAU)
            lineWidth(.25)
            line(0, 22, 0, 35)
            lineWidth(.5)
            circle(0, 37, 1.5)
        restore()
    }

    draw() {
        const { x, y, w, h } = this
        save()
        translate(x, y)
        scale(w/100)
        // now we are in 100x117

        lineWidth(.5)
        stroke(env.style.color.main)

        rect(0, 0, 100, 117)

        save()
        translate(70, 35)
            this.drawFrontal()
        restore()


        lineWidth(2)
        let by = 50

        stroke(env.style.color.hi)
        line(0, by, 20, by)

        by += 4
        stroke(env.style.color.main)
        line(0, by, 20, by)

        by += 4
        stroke(env.style.color.low)
        line(0, by, 20, by)

        restore()
    }
}


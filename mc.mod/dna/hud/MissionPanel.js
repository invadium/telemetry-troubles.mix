// main HUD container that defines core UI dimensions
class MissionPanel extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'missionPanel',

            transparent: true,
            showBorder:  false,
        }, st) )
    }

    adjust() {
        const __ = this.__
        const { x, y, w, h } = __
        const targetWidth = env.style.hud.targetWidth

        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.aspect = w / h

        const s = w / targetWidth
        this.viewport = {
            x:     x,
            y:     y,
            w:     w / s,
            h:     this.lw / this.aspect,
            scale: s,
        }
        this.viewport.aspect = this.viewport.w / this.viewport.h

        super.adjust()
    }

    lx(ux) {
        return (ux - this.x) / this.viewport.scale
    }

    ly(uy) {
        return (uy - this.y) / this.viewport.scale
    }

    lpos(upos) {
        upos[0] = (upos[0] - this.x) / this.viewport.scale
        upos[1] = (upos[1] - this.y) / this.viewport.scale
        return upos
    }

    ux(lx) {
        return lx * this.viewport.scale + this.x
    }

    uy(ly) {
        return ly * this.viewport.scale + this.y
    }

    upos(lpos) {
        lpos[0] = lpos[0] * this.viewport.scale + this.x
        lpos[1] = lpos[1] * this.viewport.scale + this.y
        return upos
    }

    drawForeground() {
        if (!this.showBorder) return

        const { x, y, w, h } = this
        lineWidth(4)
        stroke('#ff0000')
        rect(x, y, w, h)
    }

    draw() {
        const { x, y, scale: s } = this.viewport
        this.__.adjust()

        save()
        translate(x, y)
        scale(s, s)

        super.draw()

        restore()
    }

    onMouseDown(x, y, b, e) {
        super.onMouseDown(x, y, b, e)
    }
}

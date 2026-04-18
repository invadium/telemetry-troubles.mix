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

        this.scale = w / targetWidth
        this.lx = x
        this.ly = y
        this.lw = w / this.scale
        this.lh = this.lw / this.aspect
        this.laspect = this.lw / this.lh

        super.adjust()
    }

    lx(ux) {
        return (ux - this.x) / this.scale
    }

    ly(uy) {
        return (uy - this.y) / this.scale
    }

    lpos(upos) {
        upos[0] = (upos[0] - this.x) / this.scale
        upos[1] = (upos[1] - this.y) / this.scale
        return upos
    }

    ux(lx) {
        return lx * this.scale + this.x
    }

    uy(ly) {
        return ly * this.scale + this.y
    }

    upos(lpos) {
        lpos[0] = lpos[0] * this.scale + this.x
        lpos[1] = lpos[1] * this.scale + this.y
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
        this.__.adjust()

        save()
        scale(this.scale, this.scale)

        super.draw()

        restore()
    }
}

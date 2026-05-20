class Segment {

    constructor(st) {
        augment(this, {
            prev:    null,
            next:    null,
            x:       0,
            width:   0,
            running: false,
        }, st)
        if (this.wobble) this.chars = this.msg.split('')
    }

    hold() {
        this.running = false
    }

    run() {
        if (this.isBlockRunning()) return
        this.running = true
        this.x = nx(1)
    }

    evo(dt) {
        if (!this.running) return
        this.x -= this.__.scrollSpeed * dt
        if (this.x + this.width < 0) {
            // the segment run behind the screen
            this.hold()
        }
    }

    draw(by) {
        if (!this.msg) return this.x + this.width // just a gap
        const __ = this.__


        save()
            fill(__.color)

            if (this.bold) font('32px dotrice-bold')
            else font('32px dotrice-regular')
            if (!this.width) {
                this.width = textWidth(this.msg)
            }
            if (this.blink && env.realTime % 1 > .5) return this.x + this.width

            if (this.wobble) {
                let bx = this.x
                this.chars.forEach(ch => {
                    text(ch, bx, by + 6 * sin(bx * .1))
                    bx += textWidth(ch)
                })
            } else {
                text(this.msg, this.x, by)
            }
            if (this.underscore) {
                const uy = by + .33 * __.h
                stroke(__.color)
                if (this.bold) lineWidth(4)
                else lineWidth(2)
                ctx.setLineDash([4, 4])
                line(this.x, uy, this.x + this.width, uy)
            }

        restore()
        this._visible = true

        return this.x + this.width
    }

    isBlockRunning() {
        function isRunning(segment) {
            if (segment.running) return true
            if (segment.next) return isRunning(segment.next)
            return false
        }

        const res = isRunning(this)
        return res
    }
}

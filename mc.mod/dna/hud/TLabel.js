let id = 0
class TLabel {

    constructor(st) {
        extend(this, {
            name: 'tlabel' + (++id),

            x:     0,
            y:     0,
            w:     0,
            h:     0,
            msg:  'Test Message ' + id,

            color:    '#ffffff',
            outline:  '#000000',
            lineWidth: 4,
            font:      env.style.font.main,

            _centered: false,
        }, st)
    }

    adjust() {
        this.adjustSize()
        this.adjustPos()
    }

    adjustSize() {
        font(this.font.head)
        this.w = textWidth(this.msg)
        this.h = this.font.size
    }

    adjustPos() {}

    draw() {
        if (this.sync) this.sync()
        const { x, y, msg, color, outline } = this

        baseTop()
        alignLeft()
        font(this.font.head)

        if (outline) {
            lineWidth(this.lineWidth)
            stroke(outline)
            text(msg, x, y)
        }

        fill(color)
        text(msg, x, y)

        //fill('fa8620')
    }
}

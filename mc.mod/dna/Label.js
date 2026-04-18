let id = 0
class Label {

    constructor(st) {
        extend(this, {
            name: 'label' + (++id),

            rx: .5,
            ry: .5,
            msg:  'Test Message ' + id,

            color:    '#ffffff',
            outline:  '#000000',
            lineWidth: 4,
            font:     '48px pixel-operator',
        }, st)
    }

    draw() {
        const { msg, color, outline } = this
        const x   = rx(this.rx),
              y   = ry(this.ry)

        baseMiddle()
        alignCenter()
        font(this.font)

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

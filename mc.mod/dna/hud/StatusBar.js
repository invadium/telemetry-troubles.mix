class StatusBar {

    constructor(st) {
        extend(this, {
            name: 'statusBar',

            x:     0,
            y:     0,
            w:     0,
            h:     0,

            message: '',

            style: {
                padding:     10,
                background: '#000000F2',
                color:       env.style.color.title,
                font:        env.style.font.status,
            },

            debug:     false,
            hideEmpty: true,
        }, dna.hud.trait.borderForeground, st)
    }

    adjust() {
        const __ = this.__
        const style = this.style
        const font  = style.font

        this.w = __.viewport.w
        this.h = font.size + 2 * style.padding
        this.x = 0
        this.y = __.viewport.h - this.h
    }

    drawBackground() {
        const { x, y, w, h, style } = this
        fill(style.background)
        rect(x, y, w, h)
    }

    drawContent(message) {
        const { x, y, w, h, style } = this

        alignLeft()
        baseBottom()
        fill(style.color)
        font(style.font.head)
        text(message, style.padding, y + h - style.padding)
    }

    drawForeground() {}

    draw() {
        if (this.debug && !env.debug) return
        const message = env.status || this.message
        if (this.hideEmpty && !message) return

        this.drawBackground()
        if (message) this.drawContent(message)
        this.drawForeground()
    }
}

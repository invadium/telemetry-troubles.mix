class TitleBar extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'titleBar',
            x:     0,
            y:     0,
            w:     0,
            h:     0,

            style: {
                padding: 20,
            },

            transparent: true,
            showBorder:  true,
        }, st) )
    }

    init() {
        this.spawn('TLabel', {
            name: 'day',
            color: '#fa8620',
            msg: 'Day: 0',

            adjustPos: function() {
                const __ = this.__,
                       W = __.w

                this.x = .05 * W
                this.y = __.style.padding
            },
        })

        this.spawn('TLabel', {
            name: 'burn',
            font: env.style.font.header,
            color: '#fa8620',

            msg: 'Burn Rate: $100/day',

            adjustPos: function() {
                const __  = this.__,
                      day = __.day,
                      W   = __.w

                // stick to the day label
                // this.x = day.x + day.w + .05 * __.w
                
                // place in the middle
                this.x = .5 * W - .5 * this.w
                this.y = day.y
            },
        })

        this.spawn('TLabel', {
            name: 'balance',
            color: '#fa8620',
            msg: 'Balance: $1000',

            adjustPos: function() {
                const __  = this.__,
                      day = __.day,
                      W   = __.w

                this.x = .95 * W - this.w
                this.y = day.y
            },
        })
    }

    adjust() {
        const style = this.style
        super.adjust()

        let topY = 0
        this._ls.forEach(e => {
            const ty = e.y + e.h
            if (ty > topY) topY = ty
        })

        this.w = this.__.lw
        this.h = topY + style.padding
    }

    drawForeground() {
        if (!this.showBorder) return

        const { x, y, w, h } = this
        lineWidth(2)
        stroke('#ff0000')
        rect(x, y, w, h)
    }

    draw() {
        super.draw()
    }
}

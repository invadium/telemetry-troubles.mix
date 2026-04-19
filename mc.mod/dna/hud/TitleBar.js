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
        }, dna.hud.trait.borderForeground, st) )
    }

    init() {
        this.spawn('TLabel', {
            name: 'day',
            font: env.style.font.title,
            color: '#fa8620',

            msg: '',
            status:   'Today is the Day!', // TODO move to resources?

            adjustPos: function() {
                const __ = this.__,
                       W = __.w

                this.x = .05 * W
                this.y = __.style.padding
            },

            sync: function() {
                this.msg = $.mission.getTimeString()
            },
        })

        this.spawn('TLabel', {
            name: 'burn',
            font: env.style.font.title,
            color: '#fa8620',

            msg:      '',
            burnRate: -1,
            status:   'Burn!', // TODO move to resources?

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

            sync: function() {
                const burnRate = env.missionStatus.burnRate
                if (this.burnRate !== burnRate) {
                    this.burnRate = burnRate
                    this.msg = `${env.text.title.burnRate}: $${burnRate}/${env.text.title.burnRateUnit}`
                }
            },
        })

        this.spawn('TLabel', {
            name: 'balance',
            font:  env.style.font.title,
            color: '#fa8620',

            msg:      '',
            balance: -1,
            status:   'Money!', // TODO move to resources?

            adjustPos: function() {
                const __  = this.__,
                      day = __.day,
                      W   = __.w

                this.x = .95 * W - this.w
                this.y = day.y
            },

            sync: function() {
                const balance = env.missionStatus.balance
                if (this.balance !== balance) {
                    this.balance = balance
                    this.msg = `${env.text.title.balance}: $${balance}`
                }
            },
            /*
            onMouseDown(e) {
                this.msg = '$ OK'
            },
            */
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

        this.w = this.__.viewport.w
        this.h = topY + style.padding
    }

    draw() {
        super.draw()
    }

    pick(x, y, ls, opt) {
        super.pick(x, y, ls, opt)
    }
}

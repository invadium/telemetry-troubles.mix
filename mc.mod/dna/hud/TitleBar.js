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
        this.spawn('MLabel', {
            name:   'day',
            font:    env.style.font.title,
            color:   env.palette.title,
            outline: env.palette.outline,

            msg: '',
            status:   'Current day and hour', // TODO move to resources?

            adjustPos: function() {
                const __ = this.__,
                       W = __.w

                this.x = .05 * W
                this.y = __.style.padding
            },

            sync: function() {
                this.msg = `${env.text.title.day}: ${pub.missionControl.getTimeString()}`
            },
        })

        this.spawn('MLabel', {
            name:   'burn',
            font:    env.style.font.title,
            color:   env.palette.title,
            outline: env.palette.outline,

            msg:      '',
            burnRate: -1,
            status:   'The daily cost of the program', // TODO move to resources?

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

        this.spawn('MLabel', {
            name: 'balance',
            font:    env.style.font.title,
            color:   env.palette.title,
            outline: env.palette.outline,

            msg:      '',
            balance: -1,
            status:   'Do not run out of money, or the mission will be cancelled!', // TODO move to resources?

            adjustPos: function() {
                const __  = this.__,
                      day = __.day,
                      W   = __.w

                this.x = .95 * W - this.w
                this.y = day.y
            },

            sync: function() {
                const budget = env.missionStatus.balance
                if (this.budget !== budget) {
                    this.budget = budget
                    this.msg = `${env.text.title.budget}: $${budget}`
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

class Bevel extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'bevel',

            x:    0,
            y:    0,
            w:    0,
            h:    0,
            padding: {
                N:   7,
                E:   7,
                S:   32,
                W:   7,
            },

            lead: null,
            tail: null,
            tabs: 0,

            keepZ:       true,
            _centered:   false,
            transparent: true,
        }, st) )
    }

    init() {
        this.spawnTab('Main', {
            action: function() {},
            close: function()  {},
        })
        // this.spawnTab('two')
        // this.spawnTab('many')
    }

    spawnTab(title, st) {
        const tag = this.spawn(dna.Tab, augment({
            name:  'tab' + (this.tabs++),
            title: title,

            h:     30,
            w:     72,
            dive:  2,

            next: null,
            prev: null,

            chainApply: function(fn) {
                fn(this)
                if (this.next) this.next.chainApply(fn)
            },

            adjust: function() {
                const _    = this,
                      __   = this.__,
                      dive = _.dive

                // make it stick out when active and on mouse hover
                let sh = 0
                if (_._displayed) sh -= dive
                if (_._hover) sh -= dive
                if (_._toggled) sh -= dive
                this.y = __.h - __.padding.S - 3*dive - sh

                if (_.prev) {
                    this.x = _.prev.x + _.prev.w + 1
                } else {
                    this.x = __.padding.E
                }

                const ls = this._ls
                for (let i = 0; i < ls.length; i++) {
                    const e = ls[i]
                    if (e.adjust) e.adjust()
                }

                this.w = this.padding.E + this.tw + this.padding.W
                if (this.closeButton) this.w += this.closeButton.w
            },

            action: function() {},

            onDisplay: function() {
                log('show main')
                this.__.disableAll()
                if (this.displayState) {
                    this.displayState.activate()
                }
                if (this.closeButton) this.closeButton._active = true
            },
            onConceal: function() {
                log('conceal main')
                if (this.displayState) {
                    this.displayState.deactivate()
                }
                if (this.closeButton) this.closeButton._active = false
            },

            close: function() {
                log('closing ' + this.name)
                this.__.killTag(this)
            },

        }, st) )

        if (this.lead) {
            this.tail.next = tag
            tag.prev = this.tail
            this.tail = tag

            tag.spawn(dna.HaikuButton, {
                name: 'closeButton',

                adjust: function() {
                    const __ = this.__
                    this.x = __.w - this.w - 4
                    this.y = __.h - this.h - 4
                },

                onClick() {
                    // close the parent tab
                    this.__.close()
                }
            })

            /*
            tag.onDisplay = function() {
                this.closeButton._active = true
            }
            tag.onConceal = function() {
                this.closeButton._active = false
            }
            */
        } else {
            this.lead = tag
            this.tail = tag
        }
    }

    disableAll() {
        if (this.lead) this.lead.chainApply(tag => tag.conceal())
    }

    killTag(tag) {
        const prev = tag.prev
        const next = tag.next
        if (prev) prev.next = next
        if (next) next.prev = prev

        if (this.lead === tag) this.lead = next
        if (this.tail === tag) this.tail = prev

        this.detach(tag)
    }

    adjust() {
        const __ = this.__
        this.x = __.holder.w
        this.y = 0
        this.h = __.h
        this.w = __.w - __.holder.w - __.tag.w

        super.adjust()
    }

    drawContent() {
        const ls = this._ls
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]
            if (e.draw && !e.hidden) e.draw()
        }
    }

    draw() {
        const { __, x, y, w, h } = this
        const tag    = __.tag,
              holder = __.holder,
              pd     = this.padding

        /*
        const b2 = .5 * b,
              bx = holder.w

        lineWidth(b)
        stroke('#6f5f7a')
        rect( bx + b2, b2, w - b, h - b)
        */
        save()
        translate(x, y)

        fill('#6f5f7a')
        rect( 0, 0, w, h )

        this.drawContent()

        lineWidth(1)
        stroke('#000000')
        rect( 0, 0, w, h )
        rect( pd.E, pd.N, w - pd.E - pd.W, h - pd.N - pd.S)

        restore()
    }

}

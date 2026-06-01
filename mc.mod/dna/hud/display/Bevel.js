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

            keepZ:       true,
            _centered:   false,
            transparent: true,
        }, st) )
    }

    init() {
        this.spawnTag('one', {
            count:  0,
            action: function() {
                log('custom ONE')
                this.count ++
                // DEBUG
                this.__.spawnTag('tag' + this.count)
                this.__.disableAll()
            }
        })
        this.spawnTag('two')
        this.spawnTag('many')
    }

    spawnTag(id, st) {
        const tag = this.spawn(dna.Tab, augment({
            name:  id,
            title: id,

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
            },

            action: function() {
                log('opening ' + this.name)
                this.__.disableAll()
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
                    this.__.close()
                }
            })

            tag.onDisplay = function() {
                this.closeButton._active = true
            }
            tag.onConceal = function() {
                this.closeButton._active = false
            }
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

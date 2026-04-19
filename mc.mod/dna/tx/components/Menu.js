const Panel = require('/mod/mc/dna/tx/components/Panel')

class Menu extends Panel {

    constructor(st) {
        super( augment({
            x:          0,
            y:          0,
            w:          0,
            h:          0,

            selected:   0,
            title:      '',
            subtitle:   '',
            itemStep:   2,
            silentOpen: true,
            settings:   {},
        }, st) )
        this.normalizeItems()
    }

    adjust() {
        if (this.port) {
            this.x = this.port.x
            this.y = this.port.y
            this.w = this.port.w
            this.h = this.port.h
        } else {
            this.x = 0
            this.y = 0
            this.w = this.__.tw
            this.h = this.__.th
        }
    }

    lx(ux) {
        return ux - this.x
    }

    ly(uy) {
        return uy - this.y
    }

    gx(lx) {
        return lx + this.x
    }

    gy(ly) {
        return ly + this.y
    }

    /*
    activate(action) {
        switch(action) {
            case _.UP:    this.selectPrev(); break;
            case _.DOWN:  this.selectNext(); break;
            case _.LEFT:  this.actionPrev(); break;
            case _.RIGHT: this.actionNext(); break;
            case _.USE:   this.action(); break;
            case _.OPT:   if (this.onOpt) this.onOpt(); break;
        }
    }
    */

    normalizeItems() {
        if (!this.items) return

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i]
            if (isString(item)) {
                this.items[i] = {
                    name: item,
                }
            } else {
                if (item.define) item.define(this)
            }
        }
    }

    selectNext() {
        this.selected ++
        if (this.selected >= this.items.length) this.selectFirst()
        lib.sfx('move')
    }

    selectPrev() {
        this.selected --
        if (this.selected < 0) this.selectLast()
        lib.sfx('move')
    }

    selectFirst() {
        this.selected = 0
        lib.sfx('move')
    }

    selectLast() {
        this.selected = this.items.length - 1
        lib.sfx('move')
    }

    action() {
        const item = this.items[this.selected]
        if (item) {
            if (item.action) {
                item.action(this)
            } else if (this.onSelect) {
                this.onSelect(item, this.selected)
            }
            if (!item.silent) lib.sfx('use')
        }
    }

    actionNext() {
        const item = this.items[this.selected]
        if (item && item.actionNext) item.actionNext(this)
        lib.sfx('switch')
    }

    actionPrev() {
        const item = this.items[this.selected]
        if (item && item.actionPrev) item.actionPrev(this)
        lib.sfx('switch')
    }

    bind() {
        if (this.port && this.port.target) {
            const player = this.port.playerId
            log(`binding [${this.name}] -> #${player}`)
            lab.control.player.bind(this, player)
        } else {
            log('binding menu controls')
            lab.control.player.bindAll(this)
        }
    }

    show() {
        if (!this.hidden) return

        const menu = this
        this.hidden = false
        this.bind()
        this.selected = 0
        if (!this.silentOpen) {
            lib.sfx('open')
        }
    }

    unbind() {
        if (this.port) {
            const player = this.port.target.team
            log('unbinding menu from #' + player)
            lab.control.player.unbind(player)
        } else {
            log('unbinding menu controls')
            lab.control.player.unbindAll()
        }
    }

    hide() {
        const menu = this
        menu.unbind()
        this.hidden = true
        if (this.onHide) this.onHide()
    }

    defineItems(opt) {
        //this.track = null
        //this.onSelect = null
        //this.onHide = null
        //augment(this, opt)
        this.track    = opt.track
        this.onSelect = opt.onSelect
        this.onHide   = opt.onHide
        this.items    = opt.items
        this.settings = opt.settings || {}
        this.selected = 0

        this.normalizeItems()
    }

    selectFrom(opt) {
        if (opt) this.defineItems(opt)
        this.show()
    }

    selectMore(opt) {
        const menu = this
        lab.spawn(dna.hud.Transition, {
            Z: 1001,
            fadein: .5,
            keep: .5,
            fadeout: .5,

            onFadeout: function() {
                menu.defineItems(opt)
            },
        })
    }

    evo(dt) {
        if (this.hidden) return
        if (this.track) this.track(dt)
    }

    draw() {
        if (!this.items) return

        const tx = this.__
        const len = this.items.length
        // this.background() // TODO why clearing background hides the menu????

        // title
        const title = this.settings.title || this.title
        let y = floor(tx.th * .25)
        let x = floor(tx.tw/2 - title.length/2)
        tx.back(lib.cidx('base'))
            .face(lib.cidx('alert'))
            .at(x, y).print(title)

        // subtitle
        const subtitle = this.settings.subtitle || this.subtitle
        y = floor(tx.th * .9)
        x = floor(tx.tw - subtitle.length)
        tx.back(lib.cidx('base'))
            .face(lib.cidx('alert'))
            .at(x, y).print(subtitle)


        y = this.y + floor(this.h/2 - len/2)

        for (let i = 0; i < len; i++) {
            const item = this.items[i]
            const x = this.x + round(this.w/2 - item.name.length/2)
            
            if (i === this.selected) {
                tx.back(lib.cidx('alert'))
                  .face(lib.cidx('base'))
            } else {
                tx.back(lib.cidx('base'))
                  .face(lib.cidx('alert'))
            }
            tx.at(x, y).print(item.name)
            y += this.items.itemStep || this.itemStep
        }
    }

    onMouseDown(tx, ty, b, e) {
        log(`mouse #${e.button + 1} down: ${tx}:${ty}`)
    }

    onMouseUp(tx, ty, b, e) {
        log(`mouse #${e.button + 1} up: ${tx}:${ty}`)
    }

    onMouseMove(tx, ty, e) {
        // log(`mouse move: ${tx}:${ty}`)
    }

    onMouseEnter() {
        // log('menu: the mouse is in!')
    }

    onMouseExit() {
        // log('menu: the mouse is out!')
    }

}

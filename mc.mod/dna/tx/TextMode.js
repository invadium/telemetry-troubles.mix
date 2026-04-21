const CHAR  = 1
const FACE  = 2
const BACK  = 3
const CFACE = 4
const CBACK = 5
const MODE  = 6
const FX    = 7

function copyBuf(src, sw, sh, dw, dh) {
    const dest = []

    let w = sw
    let h = sh
    if (dw < sw) w = dw
    if (dh < sh) w = dh

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const val = src[y * sw + x]
            if (val !== undefined) {
                dest[y * dw + x] = val
            }
        }
    }
    return dest
}

class TextMode extends sys.LabFrame {

    constructor(st) {
        super()
        this.buf = {
            char:  [],
            face:  [],
            back:  [],
            cface: [],
            cback: [],
            mode:  [],
            fx:    [],   // effect parameters objects
        }

        this.fx = dna.tx.fx
        // make sure all fx methods are present
        const fxBase = this.fx[0]
        for (let i = 1; i < this.fx.length; i++) {
            supplement(this.fx[i], fxBase)
        }

        this.cursor = {
            x: 0,
            y: 0,
            face: 0,
            back: 0,
            mode: 0,
        }

        augment(this, {
            name: 'textMode',
            border: 0.05,

            font: env.style.font.terminal.head,
            cellWidth: env.style.font.terminal.cellWidth,
            cellHeight: env.style.font.terminal.cellHeight,

            // placeholder colors to be replaced by style config
            textColor:       '#ffffff',
            backgroundColor: '#000000',

            margins: {
                north: 0,
                east:  0,
                south: 0,
                west:  0,
            },
        })

        //this.borderColor = pal.ls[0],
        // this.backgroundColor = pal.direct.base,
        this.textColor = pal.direct.text
        this.setConstants()

        augment(this, st) 
    }

    setConstants() {
        this.CHAR  = CHAR
        this.FACE  = FACE
        this.BACK  = BACK
        this.CFACE = CFACE
        this.CBACK = CBACK
        this.MODE  = MODE
        this.FX    = FX
    }

    init() {
        /*
        const textMode = this
        trap.attach(function resize() {
            textMode.adjust()
        })
        */
    }

    resizeTextArea(tw, th) {
        if (this.tw !== tw || this.th !== th) {
            const pw = this.tw
            const ph = this.th
            const c = copyBuf(this.buf.char, pw, ph, tw, th)
            const f = copyBuf(this.buf.face, pw, ph, tw, th)
            const b = copyBuf(this.buf.back, pw, ph, tw, th)
            const cf = copyBuf(this.buf.cface, pw, ph, tw, th)
            const cb = copyBuf(this.buf.cback, pw, ph, tw, th)
            const m = copyBuf(this.buf.mode, pw, ph, tw, th)
            const x = copyBuf(this.buf.fx, pw, ph, tw, th)

            this.buf.char = c
            this.buf.face = f
            this.buf.back = b
            this.buf.cface = cf
            this.buf.cback = cb
            this.buf.mode = m
            this.buf.fx = x
            this.tw = tw
            this.th = th
        }
    }

    adjustPos() {
        // this.x = (rx(1) - this.w)/2
        // this.y = (ry(1) - this.h)/2
        const __ = this.__
        if (!__ || !__.titleBar) return

        const margins = this.margins
        this.x = margins.east
        this.y = __.titleBar.y + __.titleBar.h + margins.north
    }

    adjustByTarget() {
        // calculate aspect rate
        const nativeWidth = this.cellWidth * this.targetWidth
        const nativeHeight = this.cellHeight * this.targetHeight
        const aspect = nativeWidth/nativeHeight

        // determine the scale
        // TODO should it be dynamically precalculated?
        const scale = this.scale

        /*
        // calculate suitable scale
        const spanWidth = rx(1) - 2*ry(this.border)
        const spanHeight = ry(1) - 2*ry(this.border)
        const hscale = spanWidth / nativeWidth
        const vscale = spanHeight / nativeHeight
        let scale = hscale
        if (hscale > vscale) scale = vscale
        */

        this.resizeTextArea(this.targetWidth, this.targetHeight)
        this.scale = scale
        this.w = nativeWidth * scale
        this.h = nativeHeight * scale
        this.adjustPos()
    }

    adjustBySpan() {
        const cw = this.cellWidth * this.scale
        const ch = this.cellHeight * this.scale

        const spanWidth = rx(1) - 2*ry(this.border)
        const spanHeight = ry(1) - 2*ry(this.border)

        this.resizeTextArea(
                floor(spanWidth / cw),
                floor(spanHeight / ch))

        this.w = this.tw * cw
        this.h = this.th * ch
        this.adjustPos()
    }

    adjust() {
        if (isFun(this.adjustTargets)) this.adjustTargets()
        if (this.targetWidth && this.targetHeight) {
            this.adjustByTarget()
        } else {
            this.adjustBySpan()
        }

        for (let i = 0; i < this._ls.length; i++) {
            const g = this._ls[i]
            if (isFun(g.adjust)) g.adjust()
        }
        this.clear()
    }

    /*
    zoomIn() {
        const s = floor(this.scale * (1 + env.tune.zoomStep) * 100)/100
        this.scale = clamp(s, env.tune.minZoom, env.tune.maxZoom)
        this.adjust()
    }

    zoomOut() {
        const s = floor(this.scale * (1 - env.tune.zoomStep) * 100)/100
        this.scale = clamp(s, env.tune.minZoom, env.tune.maxZoom)
        this.adjust()
    }

    setZoom(scale) {
        this.scale = scale
    }

    getZoom() {
        return this.scale
    }
    */

    put(x, y, c, t) {
        if (x >= 0 && x < this.tw && y >= 0 && y < this.th) {

            const i = y * this.tw + x
            switch(t) {
            case FACE:
                this.buf.face[i] = c
                this.buf.cface[i] = null
                break;
            case BACK:
                this.buf.back[i] = c
                this.buf.cback[i] = null
                break;
            case CFACE:
                this.buf.cface[i] = c
                break;
            case CBACK:
                this.buf.cback[i] = c
                break;
            case MODE:
                if (!isNumber(c) || c < 0 || c >= this.fx.length) throw `wrong mode [${c}]`

                const prevMode = this.buf.mode[i]
                if (prevMode) {
                    this.fx[prevMode].unset(
                        this.buf.fx[i], this, i)
                }
                this.buf.mode[i] = c
                if (!this.buf.fx[i]) {
                    this.buf.fx[i] = {}
                }
                this.fx[c].set(this.buf.fx[i], this, i)
                break;

            case FX:
                this.buf.fx[i] = augment(this.buf.fx[i], c)
                break;

            default:
                if (c.length > 1) c = c.substring(0, 1)
                this.buf.char[i] = c
            }
        }
        return this
    }

    at(x, y) {
        // normalize within screen
        if (x < 0) x = 0
        if (x >= this.tw) x = this.tw - 1
        if (y < 0) y = 0
        if (y >= this.th) y = this.th - 1

        this.cursor.x = x
        this.cursor.y = y
        return this
    }

    next() {
        this.cursor.x ++
        if (this.cursor.x >= this.tw) {
            this.cursor.y ++
            this.cursor.x = 0
            if (this.cursor.y >= this.th) {
                this.cursor.y = 0
            }
        }
    }

    nextln() {
        this.cursor.y ++
        this.cursor.x = 0
        if (this.cursor.y >= this.th) {
            this.cursor.y = 0
        }
    }

    out(c) {
        this.put(this.cursor.x, this.cursor.y, c)
        if (this.cursor.face) {
            this.put(this.cursor.x, this.cursor.y,
                    this.cursor.face, FACE)
        }
        if (this.cursor.cface) {
            this.put(this.cursor.x, this.cursor.y,
                    this.cursor.cface, CFACE)
        }
        if (this.cursor.back) {
            this.put(this.cursor.x, this.cursor.y,
                    this.cursor.back, BACK)
        }
        if (this.cursor.cback) {
            this.put(this.cursor.x, this.cursor.y,
                    this.cursor.cback, CBACK)
        }
        if (this.cursor.mode) {
            this.put(this.cursor.x, this.cursor.y,
                this.cursor.mode, MODE)
            if (this.cursor.fx) {
                this.put(this.cursor.x, this.cursor.y,
                    this.cursor.fx, FX)
            }
        }
        this.next()
        return this
    }

    print(txt) {
        if (!txt) return
        for (let i = 0; i < txt.length; i++) {
            this.out(txt.charAt(i))
        }
        return this
    }

    println(txt) {
        this.print(txt)
        this.nextln()
        return this
    }

    face(i) {
        this.cursor.face = i
        return this
    }

    back(i) {
        this.cursor.back = i
        return this
    }

    mode(i) {
        if (!isNumber(i) || i < 0 || i >= this.fx.length) {
            throw `wrong mode [${c}]`
        }
        this.cursor.mode = i
        return this
    }

    set(settings) {
        this.cursor.fx = settings
        return this
    }

    reset() {
        this.cursor.face = 0
        this.cursor.back = 0
        this.cursor.mode = 0
        return this
    }

    clear() {
        this.reset()
        this.at(0, 0)
        for (let y = 0; y < this.th; y++) {
            for (let x = 0; x < this.tw; x++) {
                this.out(' ')
            }
        }
    }

    evo(dt) {
        const n = this.tw * this.th
        for (let i = 0; i < n; i++) {
            const mode = this.buf.mode[i]
            if (mode) {
                if (this.fx[mode].evo) {
                    this.fx[mode].evo(dt,
                        this.buf.fx[i], this, i)
                }
            }
        }

        for (let i = 0; i < this._ls.length; i++) {
            const component = this._ls[i]
            if (component.evo) component.evo(dt)
        }
    }

    renderComponents() {
        for (let i = 0; i < this._ls.length; i++) {
            const component = this._ls[i]
            if (!component.hidden) component.draw()
        }
    }

    drawContent() {
        save()

        // background(pal.ls[0]) ?????????????
        fill(this.backgroundColor)
        rect(this.x, this.y, this.w, this.h)

        translate(this.x, this.y)
        scale(this.scale, this.scale)

        font(this.font)
        baseMiddle()
        alignCenter()

        const cw = this.cellWidth
        const ch = this.cellHeight
        const hw = cw/2
        const hh = ch/2

        for (let ty = this.th - 1; ty >= 0; ty--) {
            for (let tx = this.tw - 1; tx >= 0; tx--) {
                const sh = ty * this.tw + tx
                const symbol = this.buf.char[sh]

                // background
                const cback = this.buf.cback[sh]
                if (cback) {
                    // direct color
                    fill(cback)
                    rect(tx*cw, ty*ch, cw + .5, ch + .5)
                } else {
                    const back = this.buf.back[sh]
                    if (back) {
                        // indexed color
                        fill(pal.ls[back])
                        rect(tx*cw, ty*ch, cw + .5, ch + .5)
                    }
                }

                // color
                const cface = this.buf.cface[sh]
                if (cface) {
                    // direct font color
                    fill(cface)
                } else {
                    const face = this.buf.face[sh]
                    fill(pal.ls[face] || this.textColor)
                }

                // character
                if (symbol) {
                    text(symbol, tx*cw + hw + .5, ty*ch + hh + .5)
                } else {
                    //text('.', tx*cw + hw, ty*ch + hh)
                }
            }
        }

        restore()
    }

    draw() {
        this.renderComponents()
        this.drawContent()
    }

    lx(x) {
        const sx = (x - this.x)/this.scale
        return floor(sx / this.cellWidth)
    }

    ly(y) {
        const sy = (y - this.y)/this.scale
        return floor(sy / this.cellHeight)
    }

    lpick(lx, ly, list, opt) {
        const ls = isArr(list)? list : null
        const fn = isFun(opt)? opt : (isFun(list)? list : null)

        let last
        for (let i = 0; i < this._ls.length; i++) {
            const component = this._ls[i]
            if (!component.hidden) {
                if (component.pick) {
                    const node = component.pick(lx, ly, ls, opt)
                    if (node) {
                        if (!fn || fn(node)) {
                            if (ls) ls.push(node)
                            last = node
                        }
                    }
                } else if (component._rectangular) {
                    const { x, y, w, h } = component
                    if (lx >= x && lx < x + w && ly >= y && ly < y + h) {
                        if (!fn || fn(component)) {
                            if (ls) ls.push(component)
                            last = component
                        }
                    }
                }
            }
        }

        return last
    }

    pick(ux, uy, ls, opt) {
        // translate into text coordinate space
        const lx = this.lx(ux)
        const ly = this.ly(uy)
        
        return this.lpick(lx, ly, ls, opt)
    }

    onMouseDown(tx, ty, b, e) {
        const ls = []
        this.lpick(tx, ty, ls, e => !e.disabled && isFun(e.onMouseDown))

        ls.forEach(c => {
            const ltx = c.lx? c.lx(tx) : tx
            const lty = c.ly? c.ly(ty) : ty
            c.onMouseDown(ltx, lty, b, e)
        })
    }

    onMouseUp(tx, ty, b, e) {
        const ls = []
        this.lpick(tx, ty, ls, e => !e.disabled && isFun(e.onMouseUp))
        
        ls.forEach(c => {
            const ltx = c.lx? c.lx(tx) : tx
            const lty = c.ly? c.ly(ty) : ty
            c.onMouseUp(ltx, lty, b, e)
        })
    }

    onMouseMove(tx, ty, e) {
        for (let i = 0; i < this._ls.length; i++) {
            const g = this._ls[i]
            if (!g.hidden && !g.disabled && g._rectangular) {
                const { x, y, w, h } = g
                if (tx >= x && tx < x + w && ty >= y && ty < y + h) {
                    const ltx = g.lx? g.lx(tx) : tx
                    const lty = g.ly? g.ly(ty) : ty

                    if (!g._hover) {
                        g._hover = true
                        if (isFun(g.onMouseEnter)) g.onMouseEnter(ltx, lty, e)
                    }
                    if (isFun(g.onMouseMove)) g.onMouseMove(ltx, lty, e)
                } else {
                    if (g._hover) {
                        g._hover = false
                        if (isFun(g.onMouseExit)) g.onMouseExit(e)
                    }
                }
            }
        }
    }

    onMouseExit(e) {
        for (let i = 0; i < this._ls.length; i++) {
            const g = this._ls[i]
            if (g._hover) {
                g._hover = false
                if (isFun(g.onMouseExit)) g.onMouseExit(e)
            }
        }
    }

    onMouseDrag(dx, dy, x, y, e) {
        // log(`dragging ${dx}:${dy} at ${x}:${y}`)
    }

    onMouseWheel(delta, tx, ty, e) {
        const ls = []
        this.lpick(tx, ty, ls, e => !e.disabled && isFun(e.onMouseWheel))

        ls.forEach(c => {
            const ltx = c.lx? c.lx(tx) : tx
            const lty = c.ly? c.ly(ty) : ty
            c.onMouseWheel(delta, ltx, lty, e)
        })
    }

    onAttach(e) {
        // log('attached ' + e.name)
        e.tx = this
    }
}

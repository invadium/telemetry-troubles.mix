class Panel {

    constructor(st, df) {
        augment(this, df, st)
    }

    adjust() {
        this.x = 0
        this.y = 0
        this.w = this.__.tw
        this.h = this.__.th
    }

    hide() {
        this.hidden = true
        this.__.adjust()
    }

    show() {
        this.hidden = false
        this.__.adjust()
    }

    background() {
        const tx = this.__
        const bx = this.x
        const by = this.y
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                tx.put(bx+x, by+y, ' ')
                tx.put(bx+x, by+y, 0, dry.FACE)
                tx.put(bx+x, by+y, 0, dry.BACK)
            }
        }
    }

    draw() {
        this.background()
    }
}

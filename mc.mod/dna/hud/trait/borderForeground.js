const borderForeground = {

    init() {
        delete this.name
        delete this.init
    },

    showBorder:  false,

    drawForeground() {
        if (!this.showBorder) return

        const { x, y, w, h } = this
        lineWidth(2)
        stroke('#ff0000')
        rect(x, y, w, h)
    }

}

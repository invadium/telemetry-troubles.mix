function draw() {
    const { x, y, w, h } = this

    const W = 32
    const H = 32
    const X = mouse.x - .5*W
    const Y = mouse.y - .5*H

    blocky()
    image(ctx.canvas, X, Y, W, H,  x, y, w, h)

    lineWidth(1)
    stroke('#404040')
    rect(x, y, w, h)
}

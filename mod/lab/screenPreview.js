const Z = 95

const B = 10

function draw() {
    if (!env.showBuffer) return
    const portal = mod.mc

    const w = rx(.25)
    const h = ry(.25)
    const hb = ctx.width - w - B
    const vb = ctx.height - h - B
    // smooth()
    pixelated()
    image(portal.ctx.canvas, hb, vb, w, h)
}

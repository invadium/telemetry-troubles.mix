const Z = 11

const hidden = true

// render debug rectangles
function draw() {
    const x = rx(.5),
          y = ry(.5)

    let r = 70

    while(r < .5 * ctx.height) {
        lineWidth(5)
        stroke(.55, .5, .6)
        rect(x - r, y - r, 2*r, 2*r)

        r = r + 20
    }
}

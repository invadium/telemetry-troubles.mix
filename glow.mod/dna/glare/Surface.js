class Surface {

    constructor(st) {
        augment(this, {
            a1: 0,
            a2: 0,

            color: '#ffffffff',
            lineWidth: 1,
        }, st)
    }

    draw() {
        glow.color(this.color)
        glow.lineWidth(this.lineWidth)
        glow.draw(this.mesh.vertices)
    }

}

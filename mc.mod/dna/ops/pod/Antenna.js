class Antenna {

    constructor(st) {
        augment(this, {
            name: 'antenna',
        }, st)
    }

    draw() {
        lineWidth(.5)
        stroke(pal.main)
        circle(50, 50, 25)
    }

}

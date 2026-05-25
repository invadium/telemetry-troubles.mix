class MouseProbe {

    constructor(st) {
        augment(this, {
            name: 'mouseProbe',
            
            size:  5,
            color: hsl(.5, .6, .6),
            warpedColor: '#FFFF00',
        }, st)
    }

    draw() {
        const pos = [ mouse.x, mouse.y ]

        function translate(base, pos) {
            if (base === lab) {
                base.lpos( pos )
                return
            }
            translate( base.__, pos )
            base.lpos( pos )
        }
        translate( this.__, pos )

        fill( this.color )
        block( pos[0], pos[1], this.size, this.size )
    }

}


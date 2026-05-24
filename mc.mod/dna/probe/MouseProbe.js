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
        function translate(base, pos) {
            if (base === lab) return

            translate( base.__, pos )
            base.lpos( pos )
        }

        const pos = [ mouse.x, mouse.y ]
        translate( this.__, pos )

        fill( this.color )
        block( pos[0], pos[1], this.size, this.size )

        lib.util.curve(pos, this.__.w, this.__.h)
        fill( this.warpedColor )
        block( pos[0], pos[1], this.size, this.size )
    }

}


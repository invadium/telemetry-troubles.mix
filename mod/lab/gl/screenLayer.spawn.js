const PLAIN = 0
const CRT   = 1
const MODES = 2

const screenLayer = {
    DNA: 'Layer',
    Z:   5,

    mode: CRT,

    switchMode() {
        this.mode ++
        if (this.mode >= MODES) this.mode = 0
    },

    fixCanvas() {
        return mod.mc.canvas
    },

    fixProgram() {
        switch(this.mode) {
            case CRT:   this.glProg = pin.glProg.crt;   break;
            case PLAIN: this.glProg = pin.glProg.basic; break;
        }
    },

    fixCrtUniforms() {
        const width      = 320,
              height     = 200,
              fragWidth  = 1/width,
              fragHeight = 1/height,
              hAspect    = width/height,
              vAspect    = height/width

        const lx = rx(.5),
              ly = ry(.5)

        const shiftFx = lab.fx.glitcher.shift

        // setup crt uniforms
        gl.uniform1f( gl.getUniformLocation(this.glProg, 'time'), env.time )
        gl.uniform4f( gl.getUniformLocation(this.glProg, 'glitchLevels'), shiftFx.val1, shiftFx.val2, 0, 0 )
        gl.uniform4f( gl.getUniformLocation(this.glProg, 'backgroundColor'), .2, .2, 0.1, 1.0 )
        gl.uniform4f( gl.getUniformLocation(this.glProg, 'screenResolution'), width, height, fragWidth, fragHeight )
        gl.uniform2f( gl.getUniformLocation(this.glProg, 'aspectRate'), hAspect, vAspect )
        gl.uniform2f( gl.getUniformLocation(this.glProg, 'curvature'), 3.0, 3.0 )
        gl.uniform2f( gl.getUniformLocation(this.glProg, 'scanLineOpacity'), .025, .2 )
        gl.uniform3f( gl.getUniformLocation(this.glProg, 'vignetteOpt'), .5, .5, 25 )
        gl.uniform3f( gl.getUniformLocation(this.glProg, 'hBending'), 0.7*fragWidth, 0.0*fragWidth, -0.7*fragWidth )
    },

    fixUniforms() {
        switch(this.mode) {
            case CRT:
                this.fixCrtUniforms()
                break
            case PLAIN:
                break
        }
    },

    setup() {
        if (env.config.plain) this.mode = PLAIN
    },
}

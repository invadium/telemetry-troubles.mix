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
        const gfx = lab.fx.glitcher

        const width      = gfx.screen.width,
              height     = gfx.screen.height,
              fragWidth  = 1/width,
              fragHeight = 1/height,
              hAspect    = width/height,
              vAspect    = height/width
        const lx = rx(.5),
              ly = ry(.5)

        // setup crt uniforms
        gl.uniform1f( gl.getUniformLocation(this.glProg, 'time'), env.time )
        gl.uniform4f( gl.getUniformLocation(this.glProg, 'glitchLevels'), gfx.shift.shortLevel, gfx.shift.longLevel, 0, 0 )
        const bc = gfx.screen.backgroundColor
        gl.uniform4f( gl.getUniformLocation(this.glProg, 'backgroundColor'), bc[0], bc[1], bc[2], bc[3] )
        gl.uniform4f( gl.getUniformLocation(this.glProg, 'screenResolution'), width, height, fragWidth, fragHeight )
        gl.uniform2f( gl.getUniformLocation(this.glProg, 'aspectRate'), hAspect, vAspect )
        gl.uniform2f( gl.getUniformLocation(this.glProg, 'curvature'), gfx.screen.curvature.x, gfx.screen.curvature.y )
        const slo = gfx.screen.scanLineOpacity
        gl.uniform2f( gl.getUniformLocation(this.glProg, 'scanLineOpacity'), slo.x, slo.y )
        const vg = gfx.screen.vignette
        gl.uniform3f( gl.getUniformLocation(this.glProg, 'vignetteOpt'), vg.x, vg.y, vg.z )
        const hb = gfx.screen.hBending
        gl.uniform3f( gl.getUniformLocation(this.glProg, 'hBending'), hb.r*fragWidth, hb.g*fragWidth, hb.b*fragWidth )
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

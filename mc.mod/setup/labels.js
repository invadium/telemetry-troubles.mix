function labels() {

    lab.spawn('Label', {
        Z:   101,
        rx: .25,
        ry: .05,
        color: '#fa8620',

        evo: function(dt) {
            const v0 = floor($.lab.fx.glitcher.shift.val0 * 100) / 100
            const v1 = floor($.lab.fx.glitcher.shift.val1 * 100) / 100
            const v2 = floor($.lab.fx.glitcher.shift.val2 * 100) / 100
            this.msg = `shifts: ${v0} -- ${v1} -- ${v2}`
        }
    })

}

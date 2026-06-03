function probe() {
    /*
    lab.spawn('MouseProbe', {
        size:  3,
        color: '#ff4020',
    })
    lab.hud.missionPanel.spawn('MouseProbe', {
        size:  6,
        color: '#ffff40',
    })
    */

    if ($.env.config.magnify) {
        lab.spawn('magnify', {
            x: 40,
            y: 40,
            w: 320,
            h: 320,

            init: function() {
                this.onResize()
            },
            onResize: function() {
                this.x = lab.w - this.w - 40
            },
        })
    }
}
probe.Z = 101

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
            x: 20,
            y: 20,
            w: 320,
            h: 320,
        })
    }
}
probe.Z = 101

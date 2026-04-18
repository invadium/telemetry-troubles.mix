function hud() {
    const hud = lab.spawn($.dna.hud.Hud, {
        Z:     21,
        name: 'hud',
    })

    const missionPanel = $.missionPanel = hud.spawn('MissionPanel', {
        showBorder: false,
    })

    const titleBar = $.titleBar = missionPanel.spawn('TitleBar', {
        showBorder: false,
        status:     'This is a titlebar!'
    })
    const statusBar = $.statusBar = missionPanel.spawn('StatusBar', {
        hideEmpty:  false,
        showBorder: false,
    })

    hud.adjust()
}
hud.Z = 5

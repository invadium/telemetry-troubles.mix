function hud() {
    const hud = lab.spawn($.dna.hud.Hud, {
        Z:     11,
        name: 'hud',
    })

    const missionPanel = hud.spawn('MissionPanel')

    missionPanel.spawn('TitleBar', {
    })

    hud.adjust()
}
hud.Z = 5

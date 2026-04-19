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

    const tf1 = $.textFrame1 = missionPanel.spawn('TextMode', {
        Z:            31,
        name:         'textFrame1',
        targetWidth:  40,
        targetHeight: 25,

        backgroundColor: '00000080',

        style: {
            padding: 20,
        },
    })
    tf1.adjust()
    tf1.spawn('CentralMessage', {
    })

    hud.adjust()
}
hud.Z = 5

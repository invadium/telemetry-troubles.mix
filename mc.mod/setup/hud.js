function hud() {
    const hud = lab.spawn($.dna.hud.Hud, {
        Z:     11,
        name: 'hud',
    })

    hud.spawn('TitleBar', {
    })

    hud.adjust()
    // hud.adjust() // ??? - need for proper label placement
}
hud.Z = 5

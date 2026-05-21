function handleSpecial(e) {
    switch(e.code) {
        case 'Comma':
            dir(id.index())
            break
        case 'Period':
            dir(id.last)
            id.reset()
            break
        case 'Slash':
            const MP = lab.hud.missionPanel

            if (MP.email.hidden) {
                MP.email.show()
                MP.monitor.show()
            } else {
                MP.email.hide()
                MP.monitor.hide()
            }
            break
    }
}

function keyDown(e) {
    if (e.ctrlKey) handleSpecial(e)
}

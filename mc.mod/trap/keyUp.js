function handleSpecial(e) {
    switch(e.code) {
        case 'BracketLeft':
            if (!e.shiftKey) {
                job.control.mission.normal()
            }
            break
        case 'BracketRight':
            if (!e.shiftKey) {
                job.control.mission.normal()
            }
            break
    }
}

function keyUp(e) {
    if (e.ctrlKey) handleSpecial(e)
}

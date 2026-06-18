function handleSpecial(e) {
    if (e.repeat) return

    switch(e.code) {
        case 'Comma':
            dir(id.index())
            break
        case 'Period':
            dir(id.last)
            id.reset()
            break
        case 'Slash':
            break

        case 'KeyP':
            __$.pause()
            e.stopPropagation()
            e.preventDefault()
            break
        case 'BracketLeft':
            if (e.shiftKey) {
                job.control.mission.slowDown()
            } else {
                job.control.mission.slow()
            }
            break
        case 'BracketRight':
            if (e.shiftKey) {
                job.control.mission.speedUp()
            } else {
                job.control.mission.fast()
            }
            break
    }
}

function keyDown(e) {
    if (__$.paused) {
        __$.resume()
        e.stopPropagation()
        e.preventDefault()
        return
    }

    if (e.ctrlKey) handleSpecial(e)
}

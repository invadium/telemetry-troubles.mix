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
            break
    }
}

function keyDown(e) {
    if (e.ctrlKey) handleSpecial(e)
}

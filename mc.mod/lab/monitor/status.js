function evo(dt) {
    const ls = []
    // ls.stop = (mouse.buttons & 1) > 0
    lab.hud.pick(mouse.x, mouse.y, ls)
    
    let st
    ls.forEach(e => {
        if (e.status) st = e.status
    })

    if (st) env.status = st
    else env.status = ''
}

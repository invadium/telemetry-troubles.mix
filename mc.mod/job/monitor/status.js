function evo(dt) {
    const ls = []
    ls.lmb = (mouse.buttons & 1) > 0
    ls.mmb = (mouse.buttons & 4) > 0
    ls.rmb = (mouse.buttons & 2) > 0
    lab.hud.pick(mouse.x, mouse.y, ls)
    
    let st
    ls.forEach(e => {
        if (e.status) st = e.status
    })

    if (st) env.status = st
    else env.status = ''
}

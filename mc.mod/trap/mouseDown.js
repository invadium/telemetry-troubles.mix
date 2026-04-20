function dumpNode(e) {
    if (e.name) log(`=== ${e.name} ===`)
    if (isFun(e.dump)) log(e.dump())
    console.dir(e)
}

function mouseDown(e) {
    if ($.env.debug && e.ctrlKey) {
        const ls = []
        lab.pick(e.x, e.y, ls)

        if (ls.length === 0) {
            log('....')
        } else if (ls.length === 1) {
            dumpNode(ls[0])
        } else {
            ls.forEach(e => dumpNode(e))
        }
    }
}

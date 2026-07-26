function check(src, name, path) {
    const rg = new RegExp(/^\s*----*\s*$/m)

    const parts = src.split(rg)

    const task     = parts[0]
    const solution = parts[1]
    const effect   = parts[2]

    let stack
    if (effect) {
        const lines = effect.split('\n')
        stack = lines.map(l => l.trim())
            .map(l => l.split('--')[0])
            .map(l => l.trim().toLowerCase())
            .filter(l => l)
            .map(l => parseInt(l, 16))

        stack.forEach((e, i) => {
            if (isNaN(e)) throw Error(`A hex number is expected in [${path}:#${i}]`)
        })
    }

    return {
        check: true,
        task,
        solution,
        stack,
    }
}

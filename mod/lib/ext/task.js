function task(src, name, path) {
    const rg = new RegExp(/^\s*----*\s*$/m)

    const parts = src.split(rg)

    const task = parts[0]

    let solution
    if (parts.length > 1) solution = parts[ parts.length - 1 ]
    let hint
    if (parts.length > 2) hint = parts[1]

    return {
        task,
        hint,
        solution,
    }
}

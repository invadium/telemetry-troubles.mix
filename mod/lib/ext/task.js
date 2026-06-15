function task(src, name, path) {
    let solution
    if (name.startsWith('e4')) debugger

    const rg = new RegExp(/^\s*----*\s*$/m)

    const match = rg.exec(src)
    if (match && match.length > 0) {
        solution = src.substring(match.index + match[0].length)
        src = src.substring(0, match.index)
    }

    return {
        task: src,
        solution,
    }
}

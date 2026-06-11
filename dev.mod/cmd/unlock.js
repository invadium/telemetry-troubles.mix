function unlock(args) {
    const name = args[1]
    if (!isStr(name)) throw new Error('instruction name is expected!')

    const codeSelector = $.locate('&codeSelector')

    const ls = pub.dusty.ops.filter(op => op.name === name)
    if (ls.length === 0) throw new Error(`Unknown instruction [${name}]`)

    codeSelector.unlock(name)
}
unlock.args = '<code>'
unlock.info = 'unlock a single instruction'

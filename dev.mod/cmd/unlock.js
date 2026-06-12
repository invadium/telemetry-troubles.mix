function unlock(args) {
    let name = args[1]
    if (!isStr(name)) throw new Error('instruction name or ALL is expected!')
    name = name.toUpperCase()

    const codeSelector = $.locate('&codeSelector')

    if (name === 'ALL') {
        pub.dusty.ops.forEach(ops => {
            codeSelector.unlock(ops.name)
        })
    } else {
        const ls = pub.dusty.ops.filter(op => op.name === name)
        if (ls.length === 0) throw new Error(`Unknown instruction [${name}]`)
        codeSelector.unlock(name)
    }
}
unlock.args = '<code> | ALL'
unlock.info = 'unlock a single instruction or all instructions if "ALL" provided as a code'

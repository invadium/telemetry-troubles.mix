function flush(args) {
    const name = args[1]

    if (isStr(name)) {
        const src = lib.dust._dir[ name ]
        if (!src) throw new Error(`can't find [${name}.dust]!`)

        this.print(`flushing [${name}.dust] into core memory...`)
        lab.locate('&dusty').flush(src)

    } else {
        this.print('Available .dust scripts:')
        for (let k in lib.dust._dir) {
            const src = lib.dust[k]
            this.print(`  * [${k}] - ${src.length}b`)
        }
    }
}

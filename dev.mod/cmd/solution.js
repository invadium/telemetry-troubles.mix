function solution(args) {
    const name = args[1]

    if (name && isStr(name)) {


        const src = lib.dust._dir[ name ]
        if (!src) throw new Error(`can't find [${name}.dust]!`)

        this.print(`flushing [${name}.dust] into core memory...`)

        lab.locate('&dusty').flush(src)

    } else {
        pub.missionControl.loadSolution()
    }
}
solution.info = 'load solution for the latest mission'

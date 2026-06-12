function unscrewScript(script) {
    if (!script || script.unscrewed) return 
    const { name, path, src, runes, dependencies } = script

    // unscrew dependencies first
    dependencies.forEach(d => unscrewByName(d))

    log(`unscrewing [${path}.up]: ` + runes)
    // unscrew runes without continuation
    // (e.g. don't preserve screw VM state between script executions)
    const res = $.lib.screw.unscrew( runes, false ) 
    if (isArray(res)) {
        script.geo = res
        script.createdGeometries = res.length
    }
    script.unscrewed = true
}

function unscrewByName(name) {
    const script = $.lib.glib.script[name]
    if (!script) throw new Error(`expect unknown script [${name}]`)

    unscrewScript(script)
}

function unscrewScripts(ls) {
    ls.forEach(s => unscrewScript(s))
}

function geometry() {
    log('=== scripts so far ===')
    dir($.lib.glib)
    Object.values($.lib.glib.script).forEach(s => log('  * ' + s))

    unscrewScripts($.lib.glib.script._ls)
}
geometry.Z = 5

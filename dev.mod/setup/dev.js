function dev() {
    if (!$.mod.console) return // no console to register with

    $.mod.console.lab.locate('&console').lookupList.push(__$.cmd)
}
dev.Z = 9

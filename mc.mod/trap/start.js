function start() {
    // TODO transition to the title and the main menu
    // ..
    signal('mission/start')

    defer(() => {
        if (pub.PD.stretch === 0) pub.PD.switch()
    }, 2)
    defer(() => {
        if (pub.SD.stretch === 0) pub.SD.switch()
    }, 7)
}

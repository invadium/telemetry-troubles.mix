function resize() {
    lab.applyAll(e => {
        if (isFun(e.adjust)) e.adjust()
    })
}

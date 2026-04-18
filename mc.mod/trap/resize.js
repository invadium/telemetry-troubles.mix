function resize() {
    lib.util.syncViewportSize()
    lab.hud.adjust()
    // MUST redraw the content to fill the modified framebuffer and avoid flickering
    lab.draw()
}

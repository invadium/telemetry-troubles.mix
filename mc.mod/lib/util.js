function syncViewportSize() {
    const W = round($.canvas.width  / env.tune.bufferScale),
          H = round($.canvas.height / env.tune.bufferScale)
    ctx.width  = W
    ctx.height = H
    ctx.canvas.width  = W
    ctx.canvas.height = H
    ctx.canvas.style.width  = W 
    ctx.canvas.style.height = H
}

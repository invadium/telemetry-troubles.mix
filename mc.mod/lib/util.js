function syncViewportSize() {
    const W = round($.canvas.width  / env.tune.bufferScale),
          H = round($.canvas.height / env.tune.bufferScale)
    ctx.width  = W
    ctx.height = H
    ctx.canvas.width  = W
    ctx.canvas.height = H
    ctx.canvas.style.width  = W 
    ctx.canvas.style.height = H
    lab.width  = lab.w = W
    lab.height = lab.h = H
}

function curve(pos, w, h) {
    const curvature = $.lab.fx.glitcher.screen.curvature

    const nx = 2 * (pos[0] / w) - 1,
          ny = 2 * (pos[1] / h) - 1,
          // !!! flip x/y for the offset vector!
          ox = abs(ny) / curvature.x,
          oy = abs(nx) / curvature.y,
          wx = nx + nx * ox * ox,
          wy = ny + ny * oy * oy,
          ux = .5 * (wx + 1),
          uy = .5 * (wy + 1)

    pos[0] = ux * w
    pos[1] = uy * h
    return pos
}

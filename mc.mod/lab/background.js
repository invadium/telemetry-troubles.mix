const Z = 10

const transient = true

function draw() {
    const w = lab.w,
          h = lab.h

    save()
    //ctx.clearRect(0, 0, ctx.width, ctx.height)
    //background('#165955')
    if (!h || h > 9999 || h < 0) debugger
    const gradient = ctx.createLinearGradient(0, 0, 0, h)
    env.palette.background.gradients.forEach(g => {
        gradient.addColorStop( g.stop, g.color )
    })
    fill(gradient)
    rect(0, 0, w, h)
    
    // highlight edges
    //stroke('#ffff00')
    //lineWidth(4)
    //rect(0, 0, w, h)
    
    restore()
}

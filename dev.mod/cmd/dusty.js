function dusty(args) {
    const ops = pub.dusty.ops
    let OPS = ops.map(op => `${op.name} (${op.effect}) - ${op.info}`).join('\n')

    OPS += `\nTotal: ${ops.length}`

    this.print(OPS)
    log(OPS)
}
dusty.info = 'dump DUSTY-12 specs'

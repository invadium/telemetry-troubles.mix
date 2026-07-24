function dusty(args) {
    const ops = pub.dusty.ops
    let OPS = ops.map(op => `${op.name} (${op.effect}) - ${op.info}`).join('\n')

    OPS += `\nTotal: ${ops.length}`
         + `\n--------------------\n`

    OPS += pub.probe._ls.filter(e => e.type === 'pod').map((e, i) => `#${i}: ${e.name}`).join('\n')

    this.print(OPS)
    log('\n' + OPS)
}
dusty.info = 'dump DUSTY-12 specs'

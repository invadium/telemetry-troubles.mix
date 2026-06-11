function command(args) {
    const codeSelector = $.locate('&codeSelector')

    pub.dusty.ops.forEach(ops => {
        codeSelector.unlock(ops.name)
    })
}
command.info = 'unlock all DUSTY-12 instructions'

module.exports = command

function msg(args) {
    const templateName = args[1]
    if (!templateName) {
        this.print('email template name is expected')
        return
    }

    $.mod.mc.enable()
    signal('email', templateName)
}
msg.args = '[email-template-name]'
msg.info = 'send the email from the specified template'


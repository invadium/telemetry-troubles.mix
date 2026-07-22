function ls(frame, prefix, _) {
    for (let e of frame) {
        if (isFrame(e)) {
            _.print(`${prefix}+ ${e.name}`)
            ls(e, '  ' + prefix, _)
        } else {
            _.print(`${prefix}* ${e.name}`)
        }
    }
}

function msg(args) {
    const templateName = args[1]
    if (!templateName) {
        this.print('email template name is expected')
        ls($.mod.mc.res.msg, '  ', this)
        return
    }

    $.mod.mc.enable()
    signal('email', templateName)
}
msg.args = '[email-template-name]'
msg.info = 'send the email from the specified template'


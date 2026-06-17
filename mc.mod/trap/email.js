function email(msg) {
    if ( isStr(msg) ) {
        // locate the email prototype in /res/msg by name
        const template = res.msg.locate('&' + msg)
        if (!template) throw new Error(`can't find the email template [${msg}]`)
        msg = template
    }

    const message = {
        from:     msg.from    || 'Unknown',
        subject:  msg.subject || '',
        content:  msg.content || '',

        time:     env.missionStatus.time,
        read:     false,

        onDispatch: msg.onDispatch,
        onRead:     msg.onRead,
    }

    if ( isFun(message.onDispatch) ) message.onDispatch()
    signal('dispatch', message)

    lab.locate('&inbox').accept( message )
}

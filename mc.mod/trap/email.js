function email(e) {
    if (isStr(e)) {
        // locate the email prototype in /res/msg by name
        e = res.msg.locate('&' + e)
    }
    if (!e) {
        log.warn(`ignoring signal: missing the email prototype`)
        return
    }

    lab.locate('&inbox').accept(e)
}

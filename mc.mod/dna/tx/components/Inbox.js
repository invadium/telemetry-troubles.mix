const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class Inbox extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name:  'inbox',

            UNREAD_PREFIX: '* ',

            // TODO why do we need imap in the first place? Maybe only "messages" will suffice?
            imap: {
                messages: [],
            },
        }, st) )
        /*
        for(let i = 0; i < 25; i++) {
            const N = i + 1
            const msg = {
                read: false,
                time: i + 4 + i/15,
                from:    'Space HQ',
                subject: 'Message #' + N,
                content: 'Content #' + N,
            }
            for (let j = 0; j < 50; j++) {
                msg.content = msg.content + '\n' + 'More #' + i + '/' + (j + 1)
            }
            this.imap.messages.push(msg)
        }
        */
    }

    show() {
        this.hidden = false
        this.__.adjust()
        this.title.show()
        this.scrollBar.show()
    }

    hide() {
        this.title.hide()
        this.scrollBar.hide()
        this.hidden = true
        this.__.adjust()
    }

    syncMainTab() {
        const unread = this.unread()
        const total = this.imap.messages.length
        this.mainTab.title = `InBox(${unread}/${total})`
    }

    unread() {
        const ls = this.imap.messages

        let n = 0
        for (let i = ls.length - 1; i >= 0; i--) {
            if (!ls[i].read) n++
        }

        return n
    }

    // accept a fully-formed email object
    accept( message ) {
        this.imap.messages.push( message )
        this.syncMainTab()

        if (message.sfx) sfx( message.sfx )
        else sfx('email-received')
    }

    contentLength() {
        return this.imap.messages.length
    }

    enter(tx, ty) {
        this.select(tx, ty)
        if (this.selection < 0) return

        const pos = this.contentLength() - 1 - this.stackPointer - this.selection
        if (pos < 0) return

        this.open(pos)
    }

    markRead(message) {
        if (!message || message.read) return

        if ( isFun(message.onRead) ) {
            message.onRead()
        }
        message.read = true
        signal('read', message)
        this.syncMainTab()
    }

    markAllRead() {
        const _ = this
        this.imap.messages.forEach( m => _.markRead(m) )
        this.syncMainTab()
    }

    open(pos) {
        const message = this.imap.messages[pos]

        this.markRead(message)

        defer(() => this.view.openEmail(message))
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, stackPointer } = this
        // messages
        const messages = this.imap.messages,
              NMSG     = messages.length,
              UNREAD   = messages.reduce((acc, cur) => cur.read? acc : acc + 1, 0)
        this.title.label = ` ${env.text.email.inbox}(*${UNREAD}/${NMSG}) `

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w1 = 1,
              x2 = x1 + w1 + 1,
              w2 = 8,
              x3 = x2 + w2 + 1,
              w4 = 6,
              w3 = w - w1 - w2 - w4 - 3,
              x4 = x3 + w3 + 1

        txt.back(cidx.base)
           .face(cidx.default)

        // === column titles ===
        this.clipText('#',       x1, by, w1)
        this.clipText(env.text.email.from,    x2, by, w2)
        this.clipText(env.text.email.subject, x3, by, w3)
        this.clipText(env.text.email.day,     x4, by, w4)
        txt.at(x1 + w1, by).out('|')
        txt.at(x2 + w2, by).out('|')
        txt.at(x3 + w3, by).out('|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + w3 + w4 + 3)

        // messages
        by++
        let selectionPos = 0,
            msgPrinted   = 0
        for (let i = NMSG - 1 - stackPointer; i >= 0 && by < y+h; i--, by++, selectionPos++) {
            const msg      = messages[i],
                  from     = msg.from,
                  subject  = msg.subject,
                  stime    = lib.time.toFixedString(msg.time, w4),
                  selected = (selectionPos === this.selection),
                  tag      = msg.read? ' ' : '*'
            // let from = msg.read? msg.from: `${this.UNREAD_PREFIX}${msg.from}`
            // let subject = msg.read? msg.subject : `${this.UNREAD_PREFIX}${msg.subject}`
            // const subject = msg.subject

            if (selected) {
                txt.back(cidx.pick)
                   .face(cidx.base)
                // subject = `[${subject}]`
            } else {
                txt.back(cidx.base)
                   .face(cidx.default)
            }

            this.clipText(tag,     x1, by, w1)
            this.clipText(from,    x2, by, w2)
            this.clipText(subject, x3, by, w3)
            this.clipText(stime,   x4, by, w4)
            txt.at(x1 + w1, by).out('|')
            txt.at(x2 + w2, by).out('|')
            txt.at(x3 + w3, by).out('|')

            msgPrinted ++
        }
        if (by < y+h-1 && msgPrinted > 0) {
            txt.back(cidx.base)
               .face(cidx.default)
            this.hseparator(x1, by, w1 + w2 + w3 + w4 + 3)
        }
        // this.rect(x, y + 1, w, h - 1)
    }

    onSelect(tx, ty, e, prevSelection) {
        if (this.selection !== prevSelection
                && this.selection >= 0
                && this.selection < this.contentLength()) {
            tsfx('email-selected', .1)
        }
    }

}

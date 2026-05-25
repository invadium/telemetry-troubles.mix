const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class Inbox extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name:  'inbox',

            UNREAD_PREFIX: '* ',

            // TODO move out
            imap: {
                messages: [
                    {
                        read:     false,
                        time:     1.1,
                        from:    'HQ',
                        subject: 'One',
                        content: 'some data here',
                    },
                    {
                        read:     false,
                        time:     11.4,
                        from:    'HQ',
                        subject: 'Very Long Subject Message That Will Not Fit!',
                        content: 'some data here as well',
                    },
                    {
                        read:     true,
                        time:     271.9,
                        from:    'HQ',
                        subject: 'Many',
                        content: 'no data',
                    },
                ],
            },

        }, st) )

        for(let i = 0; i < 25; i++) {
            const N = i + 1
            const msg = {
                read: false,
                time: i + 4 + i/15,
                from:    'Agent Smith',
                subject: 'Message #' + N,
                content: 'Content #' + N,
            }
            for (let j = 0; j < 50; j++) {
                msg.content = msg.content + '\n' + 'More #' + i + '/' + (j + 1)
            }
            this.imap.messages.push(msg)
        }
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

    open(pos) {
        const message = this.imap.messages[pos]
        message.read = true
        this.view.showEmail(message)
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

        txt.back(lib.cidx('base'))
           .face(lib.cidx('default'))

        // === column titles ===
        this.clipText('#',       x1, by, w1)
        this.clipText('From',    x2, by, w2)
        this.clipText('Subject', x3, by, w3)
        this.clipText('Day',     x4, by, w4)
        txt.at(x1 + w1, by).out('|')
        txt.at(x2 + w2, by).out('|')
        txt.at(x3 + w3, by).out('|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + w3 + 2)

        // messages
        by++
        let selectionPos = 0
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
                txt.back(lib.cidx('pick'))
                   .face(lib.cidx('base'))
                // subject = `[${subject}]`
            } else {
                txt.back(lib.cidx('base'))
                   .face(lib.cidx('default'))
            }

            this.clipText(tag,     x1, by, w1)
            this.clipText(from,    x2, by, w2)
            this.clipText(subject, x3, by, w3)
            this.clipText(stime,   x4, by, w4)
            txt.at(x1 + w1, by).out('|')
            txt.at(x2 + w2, by).out('|')
            txt.at(x3 + w3, by).out('|')
        }
        if (by < y+h-1) {
            this.hseparator(x1, by, w1 + w2 + w3 + 2)
        }
        // this.rect(x, y + 1, w, h - 1)
    }

}

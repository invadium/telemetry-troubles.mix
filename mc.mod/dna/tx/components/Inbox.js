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
                        subject: 'One',
                        content: 'some data here',
                    },
                    {
                        read:     false,
                        time:     11.4,
                        subject: 'Two',
                        content: 'some data here as well',
                    },
                    {
                        read:     true,
                        time:     271.9,
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
              w2 = 6,
              w1 = w - w2 - 1,
              x2 = x1 + w1 + 1

        txt.back(lib.cidx('base'))
           .face(lib.cidx('default'))

        // === column titles ===
        this.clipText('Subject', x1, by, w1)
        this.clipText('Day',     x2, by, w2)
        txt.at(x1 + w1, by).out('|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + 1)

        // messages
        by++
        let selectionPos = 0
        for (let i = NMSG - 1 - stackPointer; i >= 0 && by < y+h; i--, by++, selectionPos++) {
            const msg   = messages[i],
                  stime = lib.time.toFixedString(msg.time, w2),
                  selected = (selectionPos === this.selection)
            let subject = msg.read? msg.subject : `${this.UNREAD_PREFIX}${msg.subject}`

            if (selected) {
                txt.back(lib.cidx('pick'))
                   .face(lib.cidx('base'))
                // subject = `[${subject}]`
            } else {
                txt.back(lib.cidx('base'))
                   .face(lib.cidx('default'))
            }

            this.clipText(subject, x1, by, w1)
            this.clipText(stime,   x2, by, w2)
            txt.at(x1 + w1, by).out('|')
        }
        if (by < y+h-1) {
            this.hseparator(x1, by, w1 + w2 + 1)
        }
        // this.rect(x, y + 1, w, h - 1)
    }

}

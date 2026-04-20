function hud() {
    const hud = lab.spawn($.dna.hud.Hud, {
        Z:     21,
        name: 'hud',
    })

    const missionPanel = $.missionPanel = hud.spawn('MissionPanel', {
        showBorder: false,

        vSpan: function() {
            const _ = this
            return _.viewport.h - _.titleBar.h - _.statusBar.h
        },
    })


    const titleBar = $.titleBar = missionPanel.spawn('TitleBar', {
        showBorder: false,
        status:     'This is a titlebar!'
    })
    const statusBar = $.statusBar = missionPanel.spawn('StatusBar', {
        hideEmpty:  false,
        showBorder: false,
    })

    // === email ===
    const email = $.email = missionPanel.spawn('TextMode', {
        Z:            31,
        name:         'email',
        scale:        1.5,
        targetWidth:  32,
        targetHeight: 25,

        backgroundColor: '00000080',

        margins: {
            north: 5,
            east:  20,
        },

        adjustTargets: function() {
            const __     = this.__,
                  style  = this.style,
                  cellH  = this.cellHeight * this.scale,
                  hUnits = __.vSpan() / cellH
            this.targetWidth  = 32
            this.targetHeight = floor(.5 * hUnits) - 1
        },

    })
    email.adjust()

    /*
    const menu = email.spawn('Menu', {
        name:  'mainMenu',
        title: 'Main',
        subtitle: 'subtitle',
    })
    menu.selectFrom({
        items: [
            'one',
            'two',
            'many',
        ],
        onSelect: function() {
            log('selected!')
        },
        onHide: function() {
            log('hidden!')
        },
    })
    */
    /*
    email.spawn('CentralMessage', {
        label:  'Central Command',
        status: `I'm in the center!`,
    })
    */
    const sectionTitle = email.spawn('SectionTitle')
    const inbox = email.spawn('Inbox', {
        title: sectionTitle,
    })
    const inboxScrollBar = email.spawn('ScrollBar', {

        sync: function() {
            this.cur = inbox.relativePos()
            this.fill = inbox.relativeFill()
        },

        scrollUp: function() {
            inbox.scrollUp()
        },

        scrollDown: function() {
            inbox.scrollDown()
        },

        adjust: function() {
            const txt = this.tx

            this.x = txt.tw - 1
            this.y = 1
            this.w = 1
            this.h = txt.th - 1
        },
    })
    inbox.scrollBar = inboxScrollBar

    const emailViewTitle = email.spawn('SectionTitle', {
        FILLER: ' ',
        align: 'left',
    })
    const emailView = email.spawn('EmailView', {
        title: emailViewTitle,
        inbox: inbox,
    })
    const emailViewScrollBar = email.spawn('ScrollBar', {
        sync: function() {
            this.cur  = emailView.relativePos()
            this.fill = emailView.relativeFill()
        },

        scrollUp: function() {
            emailView.scrollUp()
        },

        scrollDown: function() {
            emailView.scrollDown()
        },

        adjust: function() {
            this.x = emailView.x + emailView.w
            this.y = emailView.y
            this.w = 1
            this.h = emailView.h
        },
    })
    emailView.scrollBar = emailViewScrollBar

    const closeButton = email.spawn('TextButton', {
        label: 'CLOSE',

        adjust() {
            const txt = this.tx
            this.x = 0
            this.y = emailView.y + emailView.h
            this.w = txt.tw
            this.h = 1
        },

        onPress: function() {
            emailView.close()
        },
    })
    emailView.closeButton = closeButton

    emailView.hide()

    // === remote monitor ===
    const monitor = $.monitor = missionPanel.spawn('TextMode', {
        Z:            32,
        name:         'monitor',
        scale:        1.5,
        targetWidth:  32,
        targetHeight: 25,

        backgroundColor: '00000080',

        margins: {
            north: 20,
            east:  20,
        },

        email,

        adjustTargets: function() {
            const __     = this.__,
                  style  = this.style,
                  cellH  = this.cellHeight * this.scale,
                  hUnits = __.vSpan() / cellH
            this.targetWidth  = 32
            this.targetHeight = floor(.5 * hUnits) - 1
        },

        adjustPos() {
            const __      = this.__,
                  email   = this.email,
                  margins = this.margins

            this.x = margins.east
            this.y = email.y + email.h + margins.north
        }
    })
    monitor.adjust()

    const monitorTitle = monitor.spawn('SectionTitle', {
        label: '  CORE MONITOR  ',
    })

    // === core dump ===
    const dump = monitor.spawn('Dump')
    const dumpScrollBar = monitor.spawn('ScrollBar', {
        sync: function() {
            this.cur = dump.relativePos()
            this.fill = dump.relativeFill()
        },

        scrollUp: function() {
            dump.scrollUp()
        },

        scrollDown: function() {
            dump.scrollDown()
        },

        adjust: function() {
            const txt = this.tx

            this.x = dump.w
            this.y = 1
            this.w = 1
            this.h = txt.th - 1
        },
    })

    // === code selector ===
    const codeSelector = monitor.spawn('CodeSelector', {
        dump: dump,

        adjust: function() {
            const txt = this.tx
            const m = this.margins
            this.w = 5
            this.x = txt.tw - this.w - 1
            this.y = m.north
            this.h = this.__.th - m.north - m.south
        }
    })

    monitor.spawn('ScrollBar', {
        sync: function() {
            this.cur  = codeSelector.relativePos()
            this.fill = codeSelector.relativeFill()
        },

        scrollUp: function() {
            codeSelector.scrollUp()
        },

        scrollDown: function() {
            codeSelector.scrollDown()
        },

        adjust: function() {
            const txt = this.tx

            this.x = codeSelector.x + codeSelector.w
            this.y = 1
            this.w = 1
            this.h = txt.th - 1
        },
    })

    hud.adjust()
}
hud.Z = 5

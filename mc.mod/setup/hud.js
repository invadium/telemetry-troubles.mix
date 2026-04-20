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
    email.spawn('ScrollBar', {

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
        label: '  MONITOR  ',
    })
    const dump = monitor.spawn('Dump')

    monitor.spawn('ScrollBar', {
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

            this.x = txt.tw - 1
            this.y = 1
            this.w = 1
            this.h = txt.th - 1
        },
    })

    hud.adjust()
}
hud.Z = 5

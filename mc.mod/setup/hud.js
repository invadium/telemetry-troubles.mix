// construct the main mission HUD
function hud() {

    // UI root node
    const hud = lab.spawn($.dna.hud.Hud, {
        Z:     21,
        name: 'hud',

        transient: true,
    })

    // create a parent component to scale the UI components
    const missionPanel = $.missionPanel = hud.spawn('MissionPanel', {
        showBorder: false,

        vSpan: function() {
            const _ = this
            return _.viewport.h - _.titleBar.h - _.statusBar.h
        },
    })

    const titleBar = $.titleBar = missionPanel.spawn('TitleBar', {
        Z:          101,
        showBorder: false,
        // status:     'Titlebar'
    })
    const statusBar = $.statusBar = missionPanel.spawn('StatusBar', {
        Z:          102,
        hideEmpty:  false,
        showBorder: false,
    })

    const blueprint = missionPanel.spawn('Blueprint', {
        Z: 11,
    })



    // === PRIMARY DISPLAY ===

    const primaryDisplay = $.PD = missionPanel.spawn('Display', {
        name: 'primaryDisplay',
        title: 'Communication',

        anchor: {
            north: titleBar,
        },
        margin: {
            north: 0,
            west:  12,
            south: 20,
        },
        normalH: .4,

        constraints: [
            _ => _.w = env.tune.displayNW * _.__.viewport.w,
            _ => _.x = -(1 - _.stretch) * (_.w - _.tag.w),
            _ => _.y = _.anchor.north.y + _.anchor.north.h + _.margin.north,
            _ => _.h = _.normalH * (_.__.viewport.h - _.y - _.margin.south),
        ],
    })

    const textBuffer1 = $.textBuffer1 = primaryDisplay.content.spawn('TextMode', {
        Z:            22,
        name:         'textBuffer',
        scale:        1.5,
        targetWidth:  32,
        targetHeight: 25,

        // TODO is it used at all????
        // backgroundColor: pal.direct.base,

        margins: {
            north: 5,
            east:  20,
        },

        adjustTargets: function() {
            const __     = this.__,
                  cellH  = this.cellHeight * this.scale,
                  hUnits = __.h / cellH

            this.targetWidth  = 32
            this.targetHeight = floor(hUnits)
        },

    })
    textBuffer1.adjust()

    const sectionTitle = textBuffer1.spawn('SectionTitle')
    const inbox = textBuffer1.spawn('Inbox', {
        title: sectionTitle,
    })
    const inboxScrollBar = textBuffer1.spawn('ScrollBar', {

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

    const emailViewTitle = textBuffer1.spawn('SectionTitle', {
        FILLER: ' ',
        align: 'left',
    })
    const emailView = textBuffer1.spawn('EmailView', {
        title: emailViewTitle,
        inbox: inbox,
    })
    const emailViewScrollBar = textBuffer1.spawn('ScrollBar', {
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

    /*
    const closeButton = textBuffer1.spawn('TextButton', {
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
    */

    emailView.hide()

    const tab0P = primaryDisplay.bevel.tab0
    extend( tab0P, {
        title: 'InBox',
        displayState: {
            __: tab0P,
            activate: function() {
                const inbox = $.PD.locate('&inbox')
                inbox.show()
            },
            deactivate: function() {
                const inbox = $.PD.locate('&inbox')
                inbox.hide()
            },
        }
    })

    /*
    const menu = textBuffer1.spawn('Menu', {
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
    textBuffer1.spawn('CentralMessage', {
        label:  'Central Command',
        status: `I'm in the center!`,
    })
    */



    // === SECONDARY DISPLAY ===

    const secondaryDisplay = $.SD = missionPanel.spawn('Display', {
        name: 'secondaryDisplay',
        title: 'Core Monitor',

        anchor: {
            north: primaryDisplay,
            south: statusBar,
        },
        margin: {
            north: 6,
            south: 16,
        },

        constraints: [
            _ => _.w = env.tune.displayNW * _.__.viewport.w,
            _ => _.x = -(1 - _.stretch) * (_.w - _.tag.w),
            _ => _.y = _.anchor.north.y + _.anchor.north.h + _.margin.north,
            // TODO calculate from other open windows?
            _ => _.h = _.__.viewport.h - _.y - _.anchor.south.h - _.margin.south,
        ],
    })
    const tab0S = secondaryDisplay.bevel.tab0
    extend( tab0S, {
        title: 'Capsule0',
        displayState: {
            __: tab0S,
            activate: function() {
                log('TODO: show all inbox components here!')
                // this.__.__.spawnTab({
                //     title: 'next' + this.__.__.tabs,
                // })
            },
            deactivate: function() {
                log('TODO: hide all inbox components here!')
            },
        }
    })

    const textBuffer2 = $.textBuffer2 = secondaryDisplay.content.spawn('TextMode', {
        Z:            24,
        name:         'textBuffer',
        scale:        1.5,
        targetWidth:  32,
        targetHeight: 25,

        adjustTargets: function() {
            const __     = this.__,
                  cellH  = this.cellHeight * this.scale,
                  hUnits = __.h / cellH

            this.targetWidth  = 32
            this.targetHeight = floor(hUnits)
        },

        adjustPos() {}
    })
    textBuffer2.adjust()

    const monitorTitle = textBuffer2.spawn('SectionTitle', {
        label: '  CORE MONITOR  ',
    })

    // === core monitor ===
    const coreMonitor = textBuffer2.spawn('CoreMonitor')
    const cmScrollBar = textBuffer2.spawn('ScrollBar', {
        sync: function() {
            this.cur = coreMonitor.relativePos()
            this.fill = coreMonitor.relativeFill()
        },

        scrollUp: function() {
            coreMonitor.scrollUp()
        },

        scrollDown: function() {
            coreMonitor.scrollDown()
        },

        adjust: function() {
            const txt = this.tx

            this.x = coreMonitor.w
            this.y = 1
            this.w = 1
            this.h = txt.th - 1
        },
    })

    // === code selector ===
    const codeSelector = textBuffer2.spawn('CodeSelector', {
        coreMonitor,

        adjust: function() {
            const txt = this.tx
            const m = this.margins
            this.w = 5
            this.x = txt.tw - this.w - 1
            this.y = m.north
            this.h = this.__.th - m.north - m.south
        }
    })

    const codeSelectorScrollBar = textBuffer2.spawn('ScrollBar', {
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

    secondaryDisplay.bevel.spawn('DustyButton', {
        name:  'upload',
        label: 'Upload',

        h: 24,
        w: 72,

        adjust: function() {
            const __ = this.__
            this.x = __.w - this.w - __.padding.E
            this.y = __.h - __.padding.S
        },

        onClick: function() {
            lab.locate('&coreMonitor').walk()
        },
    })

    hud.adjust()
}
hud.Z = 11

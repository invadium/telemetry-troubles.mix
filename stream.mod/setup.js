function setup() {
    lab.background = null
    if (!$.env.config.stream) return

    lab.spawn('AnnouncementBar', {
        Z:    -1,
        name: 'bar',

        // stick: 'top',
        stick: 'bottom',

        scrollSpeed: 100,

        init: function() {
            res.lines.forEach(line => {
                this.push(line)
            })
        },
    })
}

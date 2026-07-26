const test = {
    title:     'Add',
    reward:     1000005,

    prerequisites: function() {
        lib.command('unlock all')
        lib.command('open-data all')
    },
}
module.exports = test

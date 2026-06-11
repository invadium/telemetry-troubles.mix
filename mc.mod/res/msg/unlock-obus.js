module.exports = {
    onRead: function() {
        const codeSelector = $.locate('&codeSelector')
        codeSelector.unlock('OBUS')
    }
}

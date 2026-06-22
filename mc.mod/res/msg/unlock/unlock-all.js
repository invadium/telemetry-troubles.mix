module.exports = {
    onRead: function() {
        const codeSelector = $.locate('&codeSelector')

        pub.dusty.ops.forEach(ops => {
            codeSelector.unlock(ops.name)
        })
    }
}

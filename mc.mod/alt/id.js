const index = {}
let last = 0

function id(path) {
    if (!index[path]) {
        index[path] = 0
    }
    index[path] ++
    last = index[path]
    return last
}

id.last = function(path) {
    if (!path) return last
    if (!index[path]) return 0

    return index[path]
}

id.index = function() {
    return index
}

id.reset = function() {
    for (let path in index) {
        index[path] = 0
    }
    last = 0
}


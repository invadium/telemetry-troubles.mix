function plumb(line) {
    log('plumbing: ' + line)

    if (line.startsWith('>')) {
        const action = line.substring(1)
        const parts = action.split(':')

        switch(parts[0]) {
            case 'hint':
                const code = parts[1]
                log('looking for a hint for: ' + code)
                const sent = pub.missionControl.requestHint(code)
                pub.PD.bevel.tab0.display()

                break
        }
    }
}

function over() {
    log('=== GAME OVER ===')
    const MS = env.missionStatus
    MS.over = true
    MS.overAt = MS.time
    job.control.emailScheduler.sendAfter('game-over', 5)
}

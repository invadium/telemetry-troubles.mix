function over() {
    signal('email', 'game-over')
    log('The Mission is Over!!!')
    env.missionStatus.over = true
}

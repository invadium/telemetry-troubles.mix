function balance(args) {
    if (args.length < 2) {
        this.print(`provide the balance to set; current balance: ${env.missionStatus.balance}`)
        return
    }

    const balance = parseInt( args[1] )
    if ( isNumber(balance) ) {
        $.mission.setBalance(balance)
    } else {
        this.print('balance amount in $ is expected')
        return
    }
}
balance.args = '<$balance>'
balance.info = 'set current balance'


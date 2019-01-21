export default class statusBar extends Phaser.Scene {
    constructor() {
        super({
            key: 'statusBar',
            active: true
        })
        this.score = 0
    }
    create() {
        this.scoreText = this.add.text(660, 20, `Score: ${this.score}`, {
            font: '24px Verdana',
            fill: '#ffffff'
        })

        this.playGround = this.scene.get('playGround')
        
        this.playGround.events
            .on('addPoint', () => {
                this.score++
                this.scoreText.setText(`Score: ${this.score}`)
            })
            .on('startGame', () => {
                this.score = 0
                this.scoreText.setText(`Score: ${this.score}`)
            })
    }
}
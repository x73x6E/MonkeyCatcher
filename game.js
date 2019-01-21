import playGround from './scenes/playGround'
import statusBar from './scenes/statusBar'
import dialogWindow from './scenes/dialogWindow'

let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#76be45',
    physics: {
        default: 'arcade'
    },
    parent: 'game-container',
    scene: [playGround, statusBar, dialogWindow]
})
export default class dialogWindow extends Phaser.Scene {
    constructor() {
        super({
            key: 'dialogWindow',
            active: true
        })
    }
    preload() { 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        })     
    }
    create() {
        this.dialog = this.rexUI.add.dialog({
                x: 400,
                y: 300,

                background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1ba75a),

                content: this.add.text(0, 0, 'Use the banana to catch monkeys', {
                    font: '24px Verdana'
                }),

                actions: [
                    this.createButton(this, 'Play!')
                ],

                space: {
                    title: 25,
                    content: 25,
                    action: 15,

                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                },
          
                align: {
                    content: 'center',
                    actions: 'center'      
                }
            })
            .layout()
            .setScale(0)
        
        this.dialog.getElement('background').setStrokeStyle(2, 0x389a64)

        let tween = this.tweens.add({
            targets: this.dialog,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce',
            duration: 1000,
            repeat: 0,
            yoyo: false
        })

        this.dialog
            .on('button.click', function (button, groupName, index) {
                this.scene.sendToBack()
                this.events.emit('startGame')

            }, this)
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(2, 0xffffff)
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle()
            })
    }
    createButton(scene, text) {
        return scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xe80e0e),
    
            text: scene.add.text(0, 0, text, {
                font: '24px Verdana'
            }),
    
            space: {
                left: 30,
                right: 30,
                top: 10,
                bottom: 10
            }
        })
    }
}
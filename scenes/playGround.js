export default class playGround extends Phaser.Scene {
    constructor() {
        super({
            key: 'playGround',
            active: true
        })
    }
    preload() {
        this.load.multiatlas('scene', 'assets/scene.json', 'assets')
    }
    create() {
        this.holes = new Set()
        this.monkeys = new Set()

        this.background = this.add.image(0, 0, 'scene', 'grass_bg.png')
        this.holes.add(this.physics.add.sprite(160, 300, 'scene', 'hole/hole_empty.png'))
        this.holes.add(this.physics.add.sprite(640, 300, 'scene', 'hole/hole_empty.png'))
        this.holes.add(this.physics.add.sprite(400, 150, 'scene', 'hole/hole_empty.png'))
        this.holes.add(this.physics.add.sprite(400, 450, 'scene', 'hole/hole_empty.png'))

        this.monkeyFrameNames = this.anims.generateFrameNames('scene', {
            start: 1,
            end: 3,
            zeroPad: 2,
            prefix: 'monkey/frame',
            suffix: '.png'
        })

        this.anims.create({
            key: 'running',
            frames: this.monkeyFrameNames,
            frameRate: 16,
            repeat: -1
        })

        this.isGameOn = false

        this.dialogWindow = this.scene.get('dialogWindow')

        this.dialogWindow.events.on('startGame', () => {
            this.startGame()
        })

        this.arrow = this.input.keyboard.createCursorKeys()
    }
    update(time, dt) {
        if (!this.isGameOn) return

        for (let monkey of this.monkeys) {
            let a = Math.atan2(monkey.y - this.banana.y, monkey.x - this.banana.x)
            monkey.setAngle(a * 180 / Math.PI + 90)
            this.physics.moveToObject(monkey, this.banana, 60)

            if (this.physics.overlap(monkey, this.box)) {
                this.monkeys.delete(monkey)
                monkey.destroy()

                this.events.emit('addPoint')
                if (this.monkeys.size === 0) this.createMonkey()
                this.displaceBox()
                continue
            }
            if (this.physics.overlap(monkey, this.banana)) {
                this.endGame()
                this.showDialogWindow("You don't have the banana now", 'Play again!')
            }
            for (let hole of this.holes) {
                if (this.physics.overlap(monkey, hole)) {
                    hole.setTexture('scene', 'hole/hole_down.png')
                    setTimeout(() => {
                        hole.setTexture('scene', 'hole/hole_empty.png')
                    }, 1500)
                    this.endGame()
                    this.showDialogWindow('The monkey fell into the hole', 'Play again!')
                }
            }
        }

        this.monkeyFactory.timeToNext -= dt * 1.3
        if (this.monkeyFactory.timeToNext < 0) {
            this.createMonkey()
        }

        if (this.arrow.right.isDown) {
            this.banana.x += 3
        } else if (this.arrow.left.isDown) {
            this.banana.x -= 3
        }
        if (this.arrow.up.isDown) {
            this.banana.y -= 3
        } else if (this.arrow.down.isDown) {
            this.banana.y += 3
        }
    }
    startGame() {
        this.box = this.physics.add.sprite(-100, -100, 'scene', 'box.png')
        this.displaceBox()
        this.banana = this.physics.add.sprite(400, 300, 'scene', 'banana.png')

        this.monkeyFactory = {
            timeToRelease: 10 * 1000,
            timeToNext: 10 * 1000
        }

        this.createMonkey()

        this.events.emit('startGame')

        console.log('game started')
        this.isGameOn = true
    }
    endGame() {
        console.log('game ended')
        this.isGameOn = false

        for (let monkey of this.monkeys) {
            monkey.destroy()
        }
        this.monkeys.clear()

        this.banana.destroy()
        this.box.destroy()
    }
    displaceBox() {
        this.box.setRandomPosition(250, 250, 300, 100)
    }
    createMonkey() {
        let randomAngle = 2 * Math.PI * Math.random(),
            x = Math.cos(randomAngle) * 550 + 400,
            y = Math.sin(randomAngle) * 550 + 300,
            monkey

        x = (x > 810) ? 810 : x
        x = (x < -10) ? -10 : x
        y = (y > 610) ? 610 : y
        y = (y < -10) ? -10 : y

        monkey = this.physics.add
            .sprite(x, y, 'scene', 'monkey/frame01.png')
            .setScale(1.3, 1.3)
            .anims.play('running')

        this.monkeys.add(monkey)

        this.monkeyFactory.timeToRelease -= 0.5 * 1000
        this.monkeyFactory.timeToNext = this.monkeyFactory.timeToRelease
    }
    showDialogWindow(content, btn) {
        let score = this.scene.get('statusBar').score

        this.dialogWindow.dialog.getElement('content').setText(`${content}\nYour score was ${score}`)
        this.dialogWindow.dialog.getElement('actions[0]').getElement('text').setText(btn)
        this.dialogWindow.dialog.layout()
        this.dialogWindow.scene.bringToTop()
    }
}
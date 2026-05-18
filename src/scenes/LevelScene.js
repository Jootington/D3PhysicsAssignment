export class LevelScene extends Phaser.Scene {

    constructor() {
        super('levelScene');
    }

    create() {
        this.add.text(40, 30, 'LEVEL 1', {
            fontSize: '32px',
            color: '#ffffff'
        });

        this.add.text(40, 70, 'Press SPACE to launch | ESC to return', {
            fontSize: '20px',
            color: '#ffffff'
        });

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('startScene');
        });

        // ball
        this.ball = this.add.circle(640, 360, 16, 0xffffff);
        this.physics.add.existing(this.ball);

        this.ball.body.setCircle(16);
        this.ball.body.setBounce(1);
        this.ball.body.setCollideWorldBounds(false);

        this.hasStarted = false;
        this.hasWon = false;

        this.input.keyboard.once('keydown-SPACE', () => {
            this.hasStarted = true;
            this.ball.body.setVelocity(220, -180);
        });

        // walls
        this.topWall = this.add.rectangle(640, 160, 500, 20, 0xffffff);
        this.bottomWall = this.add.rectangle(640, 560, 500, 20, 0xffffff);
        this.leftWall = this.add.rectangle(390, 360, 20, 400, 0xffffff);
        this.rightWall = this.add.rectangle(890, 360, 20, 400, 0xffffff);

        this.colorCycle = [
            0xff0000, // red
            0xffa500, // orange
            0xffff00, // yellow
            0x00ff00, // green
            0x0000ff, // blue
            0x800080  // purple
        ];

        this.topWall.colorIndex = -1;
        this.bottomWall.colorIndex = -1;
        this.leftWall.colorIndex = -1;
        this.rightWall.colorIndex = -1;

        this.topWall.sideName = 'top';
        this.bottomWall.sideName = 'bottom';
        this.leftWall.sideName = 'left';
        this.rightWall.sideName = 'right';

        this.physics.add.existing(this.topWall, true);
        this.physics.add.existing(this.bottomWall, true);
        this.physics.add.existing(this.leftWall, true);
        this.physics.add.existing(this.rightWall, true);

        this.physics.add.collider(
            this.ball,
            [
                this.topWall,
                this.bottomWall,
                this.leftWall,
                this.rightWall
            ],
            this.hitWall,
            null,
            this
        );
    }

        hitWall(ball, wall) {

            if (this.hasWon) {
                return;
            }

            wall.colorIndex++;

            if (wall.colorIndex >= this.colorCycle.length) {
                wall.colorIndex = 0;
            }

            wall.fillColor = this.colorCycle[wall.colorIndex];
            this.checkWin();
        }
        
    checkWin() {

    if (this.hasWon) {
        return;
    }
        const walls = [
            this.topWall,
            this.bottomWall,
            this.leftWall,
            this.rightWall
        ];

        const firstColor = walls[0].colorIndex;

        // still white
        if (firstColor === -1) {
            return;
        }

        for (const wall of walls) {

            if (wall.colorIndex !== firstColor) {
                return;
            }

        }

    this.hasWon = true;

    this.ball.body.setVelocity(0, 0);

    console.log('YOU WIN');

    }
}
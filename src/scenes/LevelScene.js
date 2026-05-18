export class LevelScene extends Phaser.Scene {

    constructor() {
        super('levelScene');
    }

    create() {

        this.maxBallSpeed = 850;

        this.add.text(40, 30, 'LEVEL 1', {
            fontSize: '32px',
            color: '#ffffff'
        });

        this.add.text(40, 70, 'Press SPACE to launch | ESC to return', {
            fontSize: '20px',
            color: '#ffffff'
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('startScene');
        });

        this.ball = this.add.circle(640, 360, 16, 0xffffff);
        this.physics.add.existing(this.ball);

        this.ball.body.setCircle(16);

        this.ball.body.setBounce(3);
        this.ball.body.setDamping(true);
        this.ball.body.setDrag(0.92);

        this.ball.body.setCollideWorldBounds(false);

        this.hasStarted = false;
        this.hasWon = false;

        this.gravityAngle = 90;
        this.gravityStrength = 1500;

        this.input.keyboard.once('keydown-SPACE', () => {
            this.hasStarted = true;
            this.ball.body.setVelocity(220, -180);
        });

        this.topWall = this.add.rectangle(640, 110, 500, 20, 0xffffff);
        this.bottomWall = this.add.rectangle(640, 610, 500, 20, 0xffffff);

        this.leftWall = this.add.rectangle(390, 360, 20, 500, 0xffffff);
        this.rightWall = this.add.rectangle(890, 360, 20, 500, 0xffffff);

        this.colorCycle = [
            0xff0000,
            0xffa500,
            0xffff00,
            0x00ff00,
            0x0000ff,
            0x800080
        ];

        this.topWall.colorIndex = -1;
        this.bottomWall.colorIndex = -1;
        this.leftWall.colorIndex = -1;
        this.rightWall.colorIndex = -1;

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

    update() {
        if (!this.hasStarted || this.hasWon) {
            return;
        }

        let turnAmount = 0;

        if (this.keyA.isDown || this.cursors.left.isDown) {
            turnAmount = -1;
        }

        if (this.keyD.isDown || this.cursors.right.isDown) {
            turnAmount = 1;
        }

        if (turnAmount !== 0) {
            this.gravityAngle += turnAmount;
  this.ball.body.velocity.rotate(Phaser.Math.DegToRad(turnAmount * 0.8));
        }

        this.physics.velocityFromAngle(
            this.gravityAngle,
            this.gravityStrength,
            this.ball.body.gravity
        );

        this.ball.body.velocity.limit(this.maxBallSpeed);

        const targetRotation = -Phaser.Math.DegToRad(this.gravityAngle - 90);

        this.cameras.main.rotation = Phaser.Math.Linear(
            this.cameras.main.rotation,
            targetRotation,
            0.1
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
        this.ball.body.gravity.set(0, 0);

        console.log('YOU WIN');
    }
}
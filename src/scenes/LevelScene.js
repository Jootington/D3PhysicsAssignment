export class LevelScene extends Phaser.Scene {

    constructor() {
        super('levelScene');
    }
    
    init(data) {
        this.levelId = data.levelId || 1;

        this.levelSettings = {
            1: {
                title: 'LEVEL 1',
                walls: 4,
                colors: [0xff0000, 0xffa500, 0xffff00],
                noteKeys: ['red', 'orange', 'yellow'],
                harmonyKeys: ['redHarmony', 'orangeHarmony', 'yellowHarmony']
            },
            2: {
                title: 'LEVEL 2',
                walls: 5,
                colors: [0xff0000, 0xffa500, 0xffff00, 0x00ff00],
                noteKeys: ['red', 'orange', 'yellow', 'green'],
                harmonyKeys: ['redHarmony', 'orangeHarmony', 'yellowHarmony', 'greenHarmony']
            },
            3: {
                title: 'LEVEL 3',
                walls: 6,
                colors: [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x800080],
                noteKeys: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
                harmonyKeys: ['redHarmony', 'orangeHarmony', 'yellowHarmony', 'greenHarmony', 'blueHarmony', 'purpleHarmony']
            }
        };

        this.currentLevel = this.levelSettings[this.levelId];
    }
    
    preload() {

        this.load.audio('red', 'assets/red.mp3');
        this.load.audio('orange', 'assets/orange.mp3');
        this.load.audio('yellow', 'assets/yellow.mp3');
        this.load.audio('green', 'assets/green.mp3');
        this.load.audio('blue', 'assets/blue.mp3');
        this.load.audio('purple', 'assets/purple.mp3');

        this.load.audio('redHarmony', 'assets/redHarmony.mp3');
        this.load.audio('orangeHarmony', 'assets/orangeHarmony.mp3');
        this.load.audio('yellowHarmony', 'assets/yellowHarmony.mp3');
        this.load.audio('greenHarmony', 'assets/greenHarmony.mp3');
        this.load.audio('blueHarmony', 'assets/blueHarmony.mp3');
        this.load.audio('purpleHarmony', 'assets/purpleHarmony.mp3');
    }

    create() {
        // **** Hud stuff ****
        this.elapsedTime = 0;

        this.timerText = this.add.text(40, 110, 'Time: 0.00', {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.ratingText = this.add.text(40, 140, 'Rating: --', {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.highScore = localStorage.getItem('level1HighScore');

        this.highScoreText = this.add.text(40, 170, 'Best: ' + (this.highScore || '--'), {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.harmonyKeys = [
            'redHarmony',
            'orangeHarmony',
            'yellowHarmony',
            'greenHarmony',
            'blueHarmony',
            'purpleHarmony'
        ];
                
        this.maxBallSpeed = 850;

        this.add.text(40, 30, this.currentLevel.title, {
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
        this.bumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.bumpStrength = 350;

        this.canBump = true;
        this.bumpDistance = 25;
        this.normalBounce = 0.8;
        this.bumpBounce = 2.2;

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('startScene');
        });

        this.ball = this.add.circle(640, 360, 16, 0xffffff);
        this.physics.add.existing(this.ball);

        this.ball.body.setCircle(16);

        this.ball.body.setBounce(0.8);
        this.ball.body.setDamping(true);
        this.ball.body.setDrag(0.8);

        this.ball.body.setCollideWorldBounds(false);

        this.hasStarted = false;
        this.hasWon = false;

        this.gravityAngle = 90;
        this.gravityStrength = 600;

        this.input.keyboard.once('keydown-SPACE', () => {
            this.hasStarted = true;
            this.ball.body.setVelocity(220, -180);
        });
        this.colorCycle = this.currentLevel.colors;
        // *** DEBUG LOGS ***
        console.log('levelId:', this.levelId);
        console.log('colorCycle:', this.colorCycle);
        console.log('color count:', this.colorCycle.length);

        this.noteKeys = this.currentLevel.noteKeys;
        this.harmonyKeys = this.currentLevel.harmonyKeys;

        this.walls = [];

        if (this.currentLevel.walls === 4) {
            this.walls = [
                this.add.rectangle(640, 110, 500, 20, 0xffffff),
                this.add.rectangle(640, 610, 500, 20, 0xffffff),
                this.add.rectangle(390, 360, 20, 500, 0xffffff),
                this.add.rectangle(890, 360, 20, 500, 0xffffff)
            ];
        }

        if (this.currentLevel.walls === 5) {
            this.walls = [
                // top
                this.add.rectangle(640, 80, 320, 20, 0xffffff),

                // tiny connectors
                this.add.rectangle(440, 340, 100, 20, 0xffffff),
                this.add.rectangle(840, 340, 100, 20, 0xffffff),

                // upper left / right
                this.add.rectangle(480, 210, 20, 260, 0xffffff),
                this.add.rectangle(800, 210, 20, 260, 0xffffff),

                // middle left / right shifted inward
                this.add.rectangle(400, 490, 20, 290, 0xffffff),
                this.add.rectangle(880, 490, 20, 290, 0xffffff),

                // bottom
                this.add.rectangle(640, 645, 500, 20, 0xffffff)
            ];
        }

        if (this.currentLevel.walls === 6) {
            this.walls = [
                this.add.rectangle(640, 120, 220, 20, 0xffffff),
                this.add.rectangle(770, 220, 20, 200, 0xffffff).setAngle(-35),
                this.add.rectangle(770, 450, 20, 200, 0xffffff).setAngle(35),
                this.add.rectangle(640, 550, 220, 20, 0xffffff),
                this.add.rectangle(510, 450, 20, 200, 0xffffff).setAngle(-35),
                this.add.rectangle(510, 220, 20, 200, 0xffffff).setAngle(35)
            ];
        }

        for (const wall of this.walls) {
            wall.colorIndex = -1;
            this.physics.add.existing(wall, true);
        }

        this.physics.add.collider(
            this.ball,
            this.walls,
            this.hitWall,
            null,
            this
        );
    }

    update(time, delta) {
        if (!this.hasStarted || this.hasWon) {
            return;
        }

        this.elapsedTime += delta / 1000;
        this.timerText.setText('Time: ' + this.elapsedTime.toFixed(2));
        
        let turnAmount = 0;

        if (this.keyA.isDown || this.cursors.left.isDown) {
            turnAmount = 1;
        }

        if (this.keyD.isDown || this.cursors.right.isDown) {
            turnAmount = -1;
        }

        if (turnAmount !== 0) {
            this.gravityAngle += turnAmount;
            this.ball.body.velocity.rotate(Phaser.Math.DegToRad(turnAmount * 0.8));
        }

        if (Phaser.Input.Keyboard.JustDown(this.bumpKey)) {
            this.bumpBox();
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

    bumpBox() {
        if (!this.canBump || !this.hasStarted || this.hasWon) {
            return;
        }

        this.canBump = false;

        this.ball.body.setBounce(this.bumpBounce);

        this.cameras.main.shake(250, 0.006);

        this.time.delayedCall(500, () => {
            this.ball.body.setBounce(this.normalBounce);
            this.canBump = true;
        });
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

            this.sound.play(this.noteKeys[wall.colorIndex]);

            this.checkWin();
        }

    checkWin() {
        if (this.hasWon) {
            return;
        }
        const walls = this.walls;

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
        this.sound.play(this.harmonyKeys[firstColor]);
        this.ball.body.setVelocity(0, 0);
        this.ball.body.gravity.set(0, 0);

        console.log('YOU WIN');
    }
}
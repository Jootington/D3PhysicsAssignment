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
                noteKeys: ['red', 'purple', 'blue', 'green', 'blue', 'purple'],
                harmonyKeys: ['redHarmony', 'orangeHarmony', 'yellowHarmony', 'greenHarmony', 'blueHarmony', 'purpleHarmony']
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
                colors: [0xff0000, 0x800080, 0x0000ff],
                noteKeys: ['red', 'purple', 'blue'],
                harmonyKeys: ['redHarmony','purpleHarmony', 'blueHarmony']
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
        this.bumpBounce = 1.5;

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('startScene');
        });

        this.ball = this.add.circle(640, 360, 10, 0xffffff);
        this.physics.add.existing(this.ball);

        this.ball.body.setCircle(10);

        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true);
        this.ball.body.setDrag(0.8);

        this.ball.body.setCollideWorldBounds(false);

        this.hasStarted = false;
        this.hasWon = false;

        this.gravityAngle = 90;
        this.gravityStrength = 500;

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
            this.add.rectangle(640, 185, 350, 20, 0xffffff), // top
            this.add.rectangle(640, 535, 350, 20, 0xffffff), // bottom
            this.add.rectangle(465, 360, 20, 350, 0xffffff), // left
            this.add.rectangle(815, 360, 20, 350, 0xffffff)  // right
            ];
        }

        if (this.currentLevel.walls === 5) {
            this.walls = [
                // top
                this.add.rectangle(560, 60, 340, 20, 0xffffff),

                // tiny horizontal
                this.add.rectangle(800, 335, 180, 20, 0xffffff),

                // upper right
               this.add.rectangle(720, 195, 20, 260, 0xffffff),

                // big left
                this.add.rectangle(400, 360, 20, 580, 0xffffff),

                // lower right 
                this.add.rectangle(880, 490, 20, 290, 0xffffff),

                // bottom
                this.add.rectangle(640, 645, 500, 20, 0xffffff)
            ];
        }

        if (this.currentLevel.walls === 6) {
            this.walls = [
            // tower roof
            this.add.rectangle(640, 35, 275, 20, 0xffffff),       

            // tower left horizontal
            this.add.rectangle(422, 290, 185, 20, 0xffffff),
            // tower right horizontal
            this.add.rectangle(858, 290, 185, 20, 0xffffff),

            // tower left vertical wall
            this.add.rectangle(505, 155, 20, 250, 0xffffff),
            // tower right vertical wall
            this.add.rectangle(775, 155, 20, 250, 0xffffff),

            // large left vertical wall
            this.add.rectangle(340, 470, 20, 370, 0xffffff),
            // large right vertical wall
            this.add.rectangle(940, 470, 20, 370, 0xffffff),

            // bottom
            this.add.rectangle(640, 645, 615, 20, 0xffffff)
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
            this.cameras.main.shake(250, 0.006);
        }

        // increase bounce intensity if below a speed threshold so ball never stops bouncing or comes to a roll
        const speed = this.ball.body.velocity.length();

        if (speed < 100) {
            this.ball.body.setBounce(2.5);
        } else if (speed < 250) {
            this.ball.body.setBounce(1.5);
        } else if (this.bumpKey.isDown) {
        this.ball.body.setBounce(this.bumpBounce);
        } else {
            this.ball.body.setBounce(this.normalBounce);
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
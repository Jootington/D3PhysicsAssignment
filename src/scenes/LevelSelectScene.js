export class LevelSelectScene extends Phaser.Scene {

    constructor() {
        super('levelSelectScene');
    }

    create() {

        this.add.text(500, 100, 'SELECT LEVEL', {
            fontSize: '48px',
            color: '#ffffff'
        });

        let level1 = this.add.text(550, 250, 'LEVEL 1', {
            fontSize: '36px',
            color: '#00ff00'
        });

        level1.setInteractive();

        level1.on('pointerdown', () => {
            this.scene.start('levelScene', {
                levelId: '1'
            });
        });

        let level2 = this.add.text(550, 350, 'LEVEL 2', {
            fontSize: '36px',
            color: '#00ffff'
        });

        level2.setInteractive();

        level2.on('pointerdown', () => {
            this.scene.start('levelScene', {
                levelId: '2'
            });
        });

        let level3 = this.add.text(550, 450, 'LEVEL 3', {
            fontSize: '36px',
            color: '#ff00ff'
        });

        level3.setInteractive();

        level3.on('pointerdown', () => {
            this.scene.start('levelScene', {
                levelId: '3'
            });
        });
    }
}
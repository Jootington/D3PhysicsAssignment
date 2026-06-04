import { Start } from './scenes/Start.js';

import { LevelScene } from './scenes/LevelScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start,
        LevelScene,
        LevelSelectScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
    default: 'arcade',
    arcade: {
        debug: true,
        gravity: { y: 0 }
    }
},
}

new Phaser.Game(config);
            
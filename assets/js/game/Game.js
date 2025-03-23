import { Octopus } from '../entities/Octopus.js';
import { OctopusPool } from '../entities/OctopusPool.js';
import { Player } from '../entities/Player.js';

export class Game {
    constructor() {
        this.currentLevel = 1;
        this.activeOctopuses = 0;
        this.octopusPool = null;
        this.player = new Player(this);

        this.levelElement = document.getElementById('level');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');

        this.octopusInstances = new Map();

        document.addEventListener('octopus-destroyed', (event) => {
            const octopusElement = event.detail.octopusElement;
            const containers = document.querySelectorAll('.invaders-container');

            containers.forEach((container, containerIndex) => {
                const containerPool = this.octopusPool.pool[containerIndex] || [];
                containerPool.forEach(octopus => {
                    if (octopus.element === octopusElement) {
                        octopus.destroy();
                    }
                });
            });
        });

        this.init();
    }

    init() {
        this.octopusPool = new OctopusPool('.invaders-container', 4);

        this.player = new Player();

        this.levelElement.textContent = this.currentLevel;

        const highScore = localStorage.getItem('highScore') || 0;
        this.highScoreElement.textContent = highScore;

        this.startLevel(this.currentLevel);

        this.gameLoop();
    }

    startLevel(level) {
        this.levelElement.textContent = level;

        this.activeOctopuses = 0;

        const containers = document.querySelectorAll('.invaders-container');

        for (let containerIndex = 0; containerIndex < containers.length; containerIndex++) {
            const container = containers[containerIndex];
            const containerWidth = container.offsetWidth;

            const spacing = containerWidth / 5;

            for (let i = 0; i < 4; i++) {
                const octopus = this.octopusPool.getOctopus(containerIndex);
                if (octopus) {
                    const posX = spacing * (i + 1);
                    const posY = 30 + (40 * containerIndex);
                    this.octopusInstances.set(octopus.element, octopus);

                    const originalOnDestroy = octopus.onDestroy;
                    octopus.onDestroy = () => {
                        this.octopusInstances.delete(octopus.element);
                        if (typeof originalOnDestroy === 'function') {
                            originalOnDestroy();
                        }
                    };

                    octopus.activate(posX, posY);

                    octopus.velocity = 0.5 + (level * 0.1);

                    octopus.onDestroy = () => {
                        this.activeOctopuses--;

                        if (this.activeOctopuses <= 0) {
                            setTimeout(() => {
                                this.currentLevel++;
                                this.startLevel(this.currentLevel);
                            }, 1500);
                        }
                    };

                    this.activeOctopuses++;
                }
            }
        }
    }

    gameLoop() {
        const containers = document.querySelectorAll('.invaders-container');
        for (let i = 0; i < containers.length; i++) {
            const containerPool = this.octopusPool.pool[i] || [];
            for (const octopus of containerPool) {
                if (octopus.active) {
                    octopus.autoMove();

                }
            }
        }

        requestAnimationFrame(() => this.gameLoop());
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
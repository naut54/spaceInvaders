export class Octopus {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('octopus');
        this.element.style.position = 'absolute';

        const img = document.createElement('img');
        img.src = '../../../assets/img/octopus.png';
        img.style.width = '100px';
        img.style.height = '100px';

        this.element.appendChild(img);

        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = 0;

        this.gameWidth = 800;
        this.gameHeight = 600;
        this.active = false;
        this.onDestroy = null;

        this.movingRight = true;
        this.horizontalLimit = 0.05;
        this.verticalStep = 0.01;
        this.startX = 0;
        this.maxTravel = 0;

        this.shootIntervalId = null;
    }

    activate(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.element.style.display = 'block';
        this.updatePosition();
        this.active = true;

        this.startX = x;
        this.maxTravel = this.gameWidth * this.horizontalLimit;

        this.startRandomShooting();
    }

    startRandomShooting() {
        if (this.shootIntervalId) {
            clearInterval(this.shootIntervalId);
        }

        const randomShot = () => {
            if (this.active) {
                this.shoot();
                const randomTime = Math.floor(Math.random() * 8000) + 6000;
                clearTimeout(this.shootIntervalId);
                this.shootIntervalId = setTimeout(randomShot, randomTime);
            }
        };

        const initialDelay = Math.floor(Math.random() * 4000) + 2000;
        this.shootIntervalId = setTimeout(randomShot, initialDelay);
    }

    destroy() {
        if (this.active) {
            this.active = false;
            this.element.style.display = 'none';

            if (this.shootIntervalId) {
                clearTimeout(this.shootIntervalId);
                this.shootIntervalId = null;
            }

            if (typeof this.onDestroy === 'function') {
                this.onDestroy();
            }
        }
    }

    updatePosition() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    shoot() {
        const gameContainer = document.querySelector('.game-container');
        const playerContainer = document.querySelector('.player-container');

        if (!gameContainer || !this.active) return;

        let bullet = document.createElement('div');
        bullet.classList.add('octopus-shot');
        bullet.style.width = `10px`;
        bullet.style.height = `25px`;
        bullet.style.backgroundColor = 'purple';
        bullet.style.position = 'absolute';

        const octopusWidth = this.element.offsetWidth;
        const bulletX = this.position.x + (octopusWidth/2) - 5;
        const bulletY = this.position.y + 100;

        bullet.style.left = `${bulletX}px`;
        bullet.style.top = `${bulletY}px`;

        gameContainer.appendChild(bullet);

        bullet.style.border = '1px solid cyan';

        const moveBullet = () => {
            if (!bullet.isConnected || !this.active) {
                return;
            }

            const currentTop = parseFloat(bullet.style.top || bulletY);
            const newTop = currentTop + 5;
            bullet.style.top = `${newTop}px`;

            if (newTop > gameContainer.offsetHeight) {
                bullet.remove();
                return;
            }

            const player = document.getElementById('player');
            if (player && checkCollision(bullet, player)) {
                bullet.remove();

                console.log('Player hit!');

                const gameOverEvent = new CustomEvent('game-over', {
                    detail: { reason: 'player-hit' }
                });
                document.dispatchEvent(gameOverEvent);

                return;
            }

            requestAnimationFrame(moveBullet);
        };

        requestAnimationFrame(moveBullet);
    }

    autoMove() {
        if (!this.active) return;

        if (this.movingRight && this.position.x >= this.startX + this.maxTravel) {
            this.movingRight = false;
            this.position.y += this.gameHeight * this.verticalStep;
        } else if (!this.movingRight && this.position.x <= this.startX - this.maxTravel) {
            this.movingRight = true;
            this.position.y += this.gameHeight * this.verticalStep;
        }

        if (this.movingRight) {
            this.position.x += this.velocity;
        } else {
            this.position.x -= this.velocity;
        }

        this.updatePosition();
    }
}

function checkCollision(elementOne, elementTwo) {
    const rectOne = elementOne.getBoundingClientRect();
    const rectTwo = elementTwo.getBoundingClientRect();

    return !(rectOne.right < rectTwo.left ||
        rectOne.left > rectTwo.right ||
        rectOne.bottom < rectTwo.top ||
        rectOne.top > rectTwo.bottom);
}
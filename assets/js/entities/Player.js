class Player {
    constructor() {
        this.element = document.getElementById("player");
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = 10;
        this.width = this.element.querySelector('img').offsetWidth;
        this.playerContainer = document.querySelector('.player-container');
        this.gameWidth = this.playerContainer.offsetWidth;
        const playerContainerHeight = this.playerContainer.offsetHeight;
        this.position.y = playerContainerHeight -this.element.offsetHeight;

        this.init();
        this.setupControls();
    }

    init() {
        this.position.x = (this.gameWidth - this.width) / 2;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translateX(${this.position.x}px)`;
    }

    moveLeft() {
        this.position.x = Math.max(0, this.position.x - this.velocity);
        this.updatePosition();
    }

    moveRight() {
        const maxX = this.gameWidth - this.width;
        this.position.x = Math.min(maxX, this.position.x + this.velocity);
        this.updatePosition();
    }

    shoot() {
        let bullet = document.createElement('div');
        bullet.classList.add('shot');
        bullet.style.width = `10px`;
        bullet.style.height = `25px`;
        bullet.style.backgroundColor = 'red';

        bullet.style.position = 'absolute';
        bullet.style.transform = `translateX(${this.position.x + (this.width/2) - 5}px)`;
        bullet.style.bottom = '80px';

        this.playerContainer.appendChild(bullet);

        bullet.style.border = '1px solid yellow';

        const moveBullet = () => {
            const gameContainer = document.querySelector('.game-container');
            const currentBottom = parseFloat(getComputedStyle(bullet).bottom || '80');
            const newBottom = currentBottom + 5;
            bullet.style.bottom = `${newBottom}px`;

            const targets = document.querySelectorAll('.shell');

            if (newBottom > gameContainer.offsetHeight - 50) {
                bullet.remove();
                return;
            }

            let collision = false;
            targets.forEach(target => {
                if (checkCollision(bullet, target)) {
                    collision = true;
                    bullet.remove();
                    target.remove();
                }
            });

            if (collision) return;

            requestAnimationFrame(moveBullet);
        };

        requestAnimationFrame(moveBullet);
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
                case ' ':
                    this.shoot();
                    break;
            }
        });
    }
}

function checkCollision(elementOne, elementTwo) {
    const rectOne = elementOne.getBoundingClientRect();
    const rectTwo = elementTwo.getBoundingClientRect();

    return !(rectOne.right < rectTwo.left || rectOne.left > rectTwo.right || rectOne.bottom < rectTwo.top || rectOne.top > rectTwo.bottom);
}

document.addEventListener('DOMContentLoaded', () => {
    const player = new Player();
});
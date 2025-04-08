export class Player {
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
            if (!bullet.isConnected) {
                console.log('Bullet disconnected');
                return;
            }

            const gameContainer = document.querySelector('.game-container');
            const currentBottom = parseFloat(getComputedStyle(bullet).bottom || '80');
            const newBottom = currentBottom + 5;
            bullet.style.bottom = `${newBottom}px`;

            if (newBottom > gameContainer.offsetHeight - 50) {
                bullet.remove();
                return;
            }

            const currentTargets = document.querySelectorAll('.shell');
            const hitTarget = Array.from(currentTargets).find(target => checkCollision(bullet, target));

            if (hitTarget) {
                bullet.remove();
                hitTarget.remove();
                score(2);
                return;
            }

            const currentOctopuses = document.querySelectorAll('.octopus:not([style*="display: none"])');
            const hitOctopus = Array.from(currentOctopuses).find(octopus => checkCollision(bullet, octopus));

            if (hitOctopus) {
                bullet.remove();
                hitOctopus.style.display = 'none';

                const event = new CustomEvent('octopus-destroyed', {
                    detail: {
                        octopusElement: hitOctopus
                    }
                });
                document.dispatchEvent(event);

                score(2);
                return;
            }

            requestAnimationFrame(moveBullet);
        };

        requestAnimationFrame(moveBullet);
    }
}

function checkCollision(elementOne, elementTwo) {
    const rectOne = elementOne.getBoundingClientRect();
    const rectTwo = elementTwo.getBoundingClientRect();

    return !(rectOne.right < rectTwo.left || rectOne.left > rectTwo.right || rectOne.bottom < rectTwo.top || rectOne.top > rectTwo.bottom);
}

function score(type) {
    const scoreElement = document.querySelector('#score');
    const scoreNum = parseInt(scoreElement.innerHTML);
    switch (type) {
        case 1:
            scoreElement.innerHTML = (scoreNum).toString();
            break;
        case 2:
            scoreElement.innerHTML = (scoreNum + 100).toString();
            break;
        default:
            break;
    }

    this.scoreElement = document.getElementById('score');
    this.highScoreElement = document.getElementById('high-score');

    const highScore = parseInt(this.highScoreElement.textContent);
    console.log(highScore);
    const currentScore = parseInt(this.scoreElement.textContent);
    console.log(currentScore);

    if (currentScore > highScore || currentScore === 0) {
        localStorage.setItem('highScore', currentScore.toString())
        this.highScoreElement.textContent = currentScore.toString();
    }
}

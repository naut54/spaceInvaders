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
        this.velocity = 0.5;

        this.gameWidth = 800;
        this.gameHeight = 600;
        this.active = false;
        this.onDestroy = null;

        this.movingRight = true;
        this.horizontalLimit = 0.05;
        this.verticalStep = 0.05;
        this.startX = 0;
        this.maxTravel = 0;
    }

    activate(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.element.style.display = 'block';
        this.updatePosition();
        this.active = true;

        this.startX = x;
        this.maxTravel = this.gameWidth * this.horizontalLimit;
    }

    destroy() {
        if (this.active) {
            this.active = false;
            this.element.style.display = 'none';

            if (typeof this.onDestroy === 'function') {
                this.onDestroy();
            }
        }
    }

    updatePosition() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
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
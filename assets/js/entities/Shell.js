class Shell {
    constructor(id) {
        this.element = document.getElementById(id);
        this.blocks = [];
        this.createBlocks();
    }

    createBlocks() {
        const shellWidth = this.element.offsetWidth;
        const shellHeight = this.element.offsetHeight;
        const blockSize = shellWidth / 6;

        this.element.innerHTML = '';

        const shellShape = [
            [0, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 1]
        ];

        for (let y = 0; y < shellShape.length; y++) {
            for (let x = 0; x < shellShape[y].length; x++) {
                if (shellShape[y][x] === 1) {
                    const block = document.createElement('div');
                    block.classList.add('shell-block');
                    block.style.width = `${blockSize}px`;
                    block.style.height = `${blockSize}px`;
                    block.style.position = 'absolute';
                    block.style.left = `${x * blockSize}px`;
                    block.style.top = `${y * blockSize}px`;
                    block.style.backgroundColor = '#8bac0f';

                    this.blocks.push({
                        element: block,
                        health: 3,
                        position: { x, y }
                    });

                    this.element.appendChild(block);
                }
            }
        }
    }

    handleImpact(bulletElement) {
        const bulletRect = bulletElement.getBoundingClientRect();

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            const blockRect = block.element.getBoundingClientRect();

            if (this.checkCollision(bulletRect, blockRect)) {
                block.health--;
                this.updateBlockAppearance(block);

                if (block.health <= 0) {
                    block.element.remove();
                    this.blocks.splice(i, 1);
                }

                return true;
            }
        }

        return false;
    }

    updateBlockAppearance(block) {
        if (block.health === 2) {
            block.element.style.opacity = '0.7';
            block.element.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 80% 100%, 80% 80%, 60% 80%, 60% 100%, 0% 100%)';
        } else if (block.health === 1) {
            block.element.style.opacity = '0.4';
            block.element.style.clipPath = 'polygon(0% 0%, 20% 0%, 20% 20%, 40% 20%, 40% 0%, 100% 0%, 100% 100%, 80% 100%, 80% 80%, 60% 80%, 60% 100%, 0% 100%)';
        }
    }

    checkCollision(rectA, rectB) {
        return !(
            rectA.right < rectB.left ||
            rectA.left > rectB.right ||
            rectA.bottom < rectB.top ||
            rectA.top > rectB.bottom
        );
    }
}
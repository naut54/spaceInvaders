class OctopusPool {
    constructor(containerSelector, poolSize = 10) {
        this.pool = [];
        this.container = document.querySelector(containerSelector);
        this.poolSize = poolSize;
        this.initializePool();
    }

    initializePool() {
        this.container.forEach(container => {
            const containerPool = [];
            for (let i = 0; i < this.poolSize; i++) {
                const octopus = new Octopus();
                octopus.element.style.display = 'none';
                container.appendChild(octopus.element);
                containerPool.push(octopus);
            }
            this.pool.push(containerPool);
        });
    }

    getOctopus(containerIndex) {
        if (containerIndex < 0 || containerIndex >= this.pool.length) {
            return null;
        }

        const containerPool = this.pool[containerIndex];

        for (const octopus of containerPool) {
            if (octopus.element.style.display === 'none') {
                octopus.element.style.display = 'block';
                return octopus;
            }
        }

        return null;
    }

    releaseOctopus(octopus) {
        octopus.element.style.display = 'none';
    }
}
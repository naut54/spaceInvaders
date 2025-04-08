import { Octopus } from './Octopus.js';

export class OctopusPool {
    constructor(containerSelector, poolSize) {
        this.pool = [];
        this.containerSelector = containerSelector;
        this.poolSize = poolSize;
        this.initializePool();
    }

    initializePool() {
        const containers = document.querySelectorAll(this.containerSelector);
        let globalIndex = 0;
        try {
            containers.forEach(container => {
                console.log('Número total de contenedores:', containers.length);
                const containerPool = [];
                for (let i = 0; i < this.poolSize; i++) {
                    const octopus = new Octopus();
                    if (!octopus || !octopus.element) {
                        throw new Error('Error al crear Octopus');
                    }
                    octopus.element.style.display = 'none';
                    octopus.element.id = `octopus-${++globalIndex}`;
                    container.appendChild(octopus.element);
                    containerPool.push(octopus);
                }
                this.pool.push(containerPool);
            });
        } catch (error) {
            throw error;
        }
    }

    getOctopus(containerIndex) {
        if (containerIndex < 0 || containerIndex >= this.pool.length) {
            return null;
        }

        const containerPool = this.pool[containerIndex];

        for (const octopus of containerPool) {
            if (!octopus.active) {
                return octopus;
            }
        }

        return null;
    }
}
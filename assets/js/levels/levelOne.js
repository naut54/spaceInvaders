import { Octopus } from '../entities/Octopus.js';
import { OctopusPool } from '../entities/OctopusPool';

document.addEventListener('DOMContentLoaded', () => {
    const octopusPool = new OctopusPool('.invaders-container', 4);

    let currentLevel = 1;
    let activeOctopuses = 0;
    let totalOctopuses = 0;
    const maxOctopusesPerContainer = 4;
    const totalContainers = document.querySelectorAll('.invaders-container').length;

    function startLevel(level) {
        document.getElementById('level').textContent = level;

        activeOctopuses = 0;
        totalOctopuses = maxOctopusesPerContainer * totalContainers;

        for (let containerIndex = 0; containerIndex < totalContainers; containerIndex++) {
            spawnOctopusesInContainer(containerIndex);
        }
    }

    function spawnOctopusesInContainer(containerIndex) {
        const container = document.querySelectorAll('.invaders-container')[containerIndex];
        const containerWidth = container.offsetWidth;

        const spacing = containerWidth / (maxOctopusesPerContainer + 1);

        for (let i = 0; i < maxOctopusesPerContainer; i++) {
            const octopus = octopusPool.getOctopus(containerIndex);
            if (octopus) {
                const posX = spacing * (i + 1);
                const posY = 30 + (20 * containerIndex);

                octopus.activate(posX, posY);

                octopus.velocity = 0.5 + (currentLevel * 0.1);

                octopus.onDestroy = () => {
                    octopusPool.releaseOctopus(octopus);
                    activeOctopuses--;

                    if (activeOctopuses <= 0) {
                        currentLevel++;
                        setTimeout(() => startLevel(currentLevel), 2000);
                    }
                };

                activeOctopuses++;
            }
        }
    }

    startLevel(currentLevel);
});
export const colorMaxLevel = 10000;
export const learningMinPercentage = 0.00001;
export const learningMaxPercentage = 0.98999;

export function getColor(level: number): string {
    if (typeof level === 'undefined') {
        return '';
    }
    if (level === 0) {
        return 'rgb(150, 150, 150)';
    }
    const constantColor = 255;
    const linearColor = Math.ceil(255 * level / colorMaxLevel);
    const quadraticColor = Math.ceil(255 * level * level / colorMaxLevel / colorMaxLevel);

    return `rgb(${constantColor}, ${linearColor}, ${quadraticColor})`;
}

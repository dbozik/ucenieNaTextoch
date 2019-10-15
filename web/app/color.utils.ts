export const colorMaxLevel = 10000;

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

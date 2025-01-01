export function isWithinSphereBoundary(position, radius = 850) {
    const distanceFromCenter = position.length();
    return distanceFromCenter <= radius;
} 
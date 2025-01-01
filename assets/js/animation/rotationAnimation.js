import gsap from 'gsap';

export function setupRotationAnimation(groupCubes) {
    const rotationTimeline = gsap.timeline({
        repeat: -1
    });
    
    rotationTimeline.from(groupCubes.rotation, {
        duration: 100,
        y: Math.PI * 2,
        ease: "none",
        repeat: -1
    });

    return rotationTimeline;
}

export function updateAnimationSpeed(timeline, isPlaying) {
    if (!isPlaying) {
        timeline.timeScale(1); // Normal speed when sound is paused
        console.log('Normal speed playing');
    } else {
        timeline.timeScale(18);
        console.log('Faster speed');
    }
} 
export function setupInfoBox() {
    const infoBox = document.querySelector('.controls-info');
    
    // Fade out after 5 seconds
    setTimeout(() => {
        infoBox.classList.add('fade');
    }, 5000);
} 
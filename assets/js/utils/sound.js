class SoundManager {
    constructor() {
        this.audioContext = null;
        this.audioBuffer = null;
        this.audioSource = null;
        this.isPlaying = false;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const response = await fetch('/sounds/ambient.wav');
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    toggle() {
        if (!this.audioContext) {
            this.init().then(() => {
                this.play();
                const button = document.getElementById('soundToggle');
                button.classList.toggle('active');
            });
            return;
        }

        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }

        const button = document.getElementById('soundToggle');
        button.classList.toggle('active');
    }

    play() {
        if (!this.audioBuffer) return;
        
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.loop = true;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.start();
        this.isPlaying = true;
    }

    stop() {
        if (this.audioSource) {
            this.audioSource.stop();
            this.audioSource.disconnect();
            this.audioSource = null;
        }
        this.isPlaying = false;
    }
}

export const soundManager = new SoundManager(); 
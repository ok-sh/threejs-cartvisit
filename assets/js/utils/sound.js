class SoundManager {
    constructor() {
        this.audioContext = null;
        this.audioBuffer = null;
        this.audioSource = null;
        this.isPlaying = false;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    async init() {
        try {
            // Create audio context with iOS-compatible options
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext({
                latencyHint: 'interactive',
                sampleRate: 44100
            });

            // iOS requires user interaction to start audio context
            if (this.isIOS && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const response = await fetch('/sounds/ambient.wav');
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    async toggle() {
        try {
            if (!this.audioContext) {
                await this.init();
            }

            // iOS requires resuming the audio context on user interaction
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            if (this.isPlaying) {
                this.stop();
            } else {
                this.play();
            }

            const button = document.getElementById('soundToggle');
            button.classList.toggle('active');
        } catch (error) {
            console.error('Error toggling audio:', error);
        }
    }

    play() {
        if (!this.audioBuffer || this.isPlaying) return;
        
        try {
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.loop = true;
            this.audioSource.connect(this.audioContext.destination);
            this.audioSource.start();
            this.isPlaying = true;
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    stop() {
        if (this.audioSource) {
            try {
                this.audioSource.stop();
                this.audioSource.disconnect();
                this.audioSource = null;
            } catch (error) {
                console.error('Error stopping audio:', error);
            }
        }
        this.isPlaying = false;
    }
}

export const soundManager = new SoundManager(); 
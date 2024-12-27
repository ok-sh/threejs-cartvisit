class SoundManager {
    constructor() {
        this.audioContext = null;
        this.audioBuffer = null;
        this.audioSource = null;
        this.isPlaying = false;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.unlocked = false;
    }

    async init() {
        try {
            // Create audio context with iOS-compatible options
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext({
                latencyHint: 'interactive',
                sampleRate: 44100
            });

            // Set up unlock function for iOS
            if (this.isIOS) {
                document.addEventListener('touchstart', this.unlock.bind(this), true);
                document.addEventListener('touchend', this.unlock.bind(this), true);
                document.addEventListener('click', this.unlock.bind(this), true);
            }

            const response = await fetch('/sounds/ambient.wav');
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    async unlock() {
        if (this.unlocked) return;

        // Create and play a short silent buffer
        const silentBuffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = silentBuffer;
        source.connect(this.audioContext.destination);
        source.start(0);
        source.stop(0.001);

        // Resume audio context
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.unlocked = true;
    }

    async toggle() {
        try {
            if (!this.audioContext) {
                await this.init();
            }

            if (this.isIOS && !this.unlocked) {
                await this.unlock();
            }

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
            // Create a new GainNode for volume control
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);

            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.loop = true;
            this.audioSource.connect(gainNode);
            
            // Fade in to prevent clicks
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);
            
            this.audioSource.start(0);
            this.isPlaying = true;
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    stop() {
        if (this.audioSource) {
            try {
                const gainNode = this.audioSource.gainNode;
                if (gainNode) {
                    // Fade out to prevent clicks
                    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
                    setTimeout(() => {
                        this.audioSource.stop();
                        this.audioSource.disconnect();
                        this.audioSource = null;
                    }, 100);
                } else {
                    this.audioSource.stop();
                    this.audioSource.disconnect();
                    this.audioSource = null;
                }
            } catch (error) {
                console.error('Error stopping audio:', error);
            }
        }
        this.isPlaying = false;
    }
}

export const soundManager = new SoundManager();
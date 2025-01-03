import { Howl } from 'howler';

class SoundManager {
    constructor() {
        this.sound = null;
        this.isPlaying = false;
        this.clickSound = null;
    }

    async init() {
        try {
            this.sound = new Howl({
                src: ['/sounds/echoes_of_neon_dreams.mp3'],
                loop: true,
                volume: 0.5,
                html5: true, // Force HTML5 Audio to help with mobile playback
                preload: true,
                onload: () => {
                    console.log('Sound loaded successfully');
                },
                onloaderror: (id, error) => {
                    console.error('Error loading sound:', error);
                }
            });

            this.clickSound = new Howl({
                src: ['/sounds/click.wav'],
                volume: 0.3,
                preload: true
            });
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    async toggle() {
        try {
            if (!this.sound) {
                await this.init();
            }

            if (this.isPlaying) {
                this.pause();
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
        if (!this.sound || this.isPlaying) return;
        
        try {
            if (this.sound.seek() > 0) {
                // Resume from where it was paused
                this.sound.play();
            } else {
                // Start from beginning if it's the first play
                this.sound.play();
            }
            this.isPlaying = true;
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    pause() {
        if (this.sound) {
            try {
                this.sound.pause();
                this.isPlaying = false;
            } catch (error) {
                console.error('Error pausing audio:', error);
            }
        }
    }

    stop() {
        if (this.sound) {
            try {
                this.sound.stop();
                this.isPlaying = false;
            } catch (error) {
                console.error('Error stopping audio:', error);
            }
        }
    }

    playClick() {
        if (this.clickSound) {
            this.clickSound.play();
        } else {
            this.init().then(() => {
                this.clickSound.play();
            });
        }
    }
}

export const soundManager = new SoundManager();
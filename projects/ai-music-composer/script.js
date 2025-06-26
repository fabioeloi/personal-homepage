// AI Music Composer Interactive Demo

document.addEventListener('DOMContentLoaded', function() {
    initializeControls();
    initializeAudioPlayer();
    initializeCompositionPlayer();
});

function initializeControls() {
    const tempoSlider = document.getElementById('tempo');
    const tempoValue = document.getElementById('tempo-value');
    const complexitySlider = document.getElementById('complexity');
    const complexityValue = document.getElementById('complexity-value');
    const generateBtn = document.getElementById('generate-btn');

    // Update tempo display
    tempoSlider.addEventListener('input', function() {
        tempoValue.textContent = this.value + ' BPM';
    });

    // Update complexity display
    complexitySlider.addEventListener('input', function() {
        complexityValue.textContent = this.value;
    });

    // Generate composition
    generateBtn.addEventListener('click', function() {
        generateComposition();
    });
}

function generateComposition() {
    const genre = document.getElementById('genre').value;
    const tempo = document.getElementById('tempo').value;
    const complexity = document.getElementById('complexity').value;
    const generateBtn = document.getElementById('generate-btn');
    const audioPlayer = document.getElementById('audio-player');

    // Show loading state
    generateBtn.textContent = 'Generating...';
    generateBtn.classList.add('generating');
    generateBtn.disabled = true;

    // Simulate AI generation process
    setTimeout(() => {
        // Reset button
        generateBtn.textContent = 'Generate Composition';
        generateBtn.classList.remove('generating');
        generateBtn.disabled = false;

        // Show audio player
        audioPlayer.style.display = 'block';
        
        // Generate waveform visualization
        generateWaveform(genre, tempo, complexity);
        
        // Show success message
        showNotification(`Generated ${genre} composition at ${tempo} BPM with complexity level ${complexity}!`);
    }, 3000);
}

function generateWaveform(genre, tempo, complexity) {
    const canvas = document.getElementById('waveform');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);

    // Generate waveform based on parameters
    const samples = 200;
    const amplitude = height / 3;
    const frequency = parseFloat(tempo) / 120; // Normalize tempo
    const complexityFactor = parseFloat(complexity) / 5;

    ctx.strokeStyle = getGenreColor(genre);
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < samples; i++) {
        const x = (i / samples) * width;
        let y = height / 2;

        // Base wave
        y += Math.sin((i / samples) * Math.PI * 8 * frequency) * amplitude * 0.5;
        
        // Add complexity
        y += Math.sin((i / samples) * Math.PI * 16 * frequency) * amplitude * 0.3 * complexityFactor;
        y += Math.sin((i / samples) * Math.PI * 32 * frequency) * amplitude * 0.2 * complexityFactor;
        
        // Add genre-specific characteristics
        y += getGenreModulation(genre, i, samples, amplitude);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = getGenreColor(genre);
    ctx.shadowBlur = 10;
    ctx.stroke();
}

function getGenreColor(genre) {
    const colors = {
        classical: '#00d4ff',
        jazz: '#ff006e',
        electronic: '#ffbe0b',
        ambient: '#8ecae6'
    };
    return colors[genre] || '#00d4ff';
}

function getGenreModulation(genre, index, samples, amplitude) {
    const progress = index / samples;
    
    switch(genre) {
        case 'classical':
            return Math.sin(progress * Math.PI * 4) * amplitude * 0.2;
        case 'jazz':
            return (Math.random() - 0.5) * amplitude * 0.3;
        case 'electronic':
            return Math.sign(Math.sin(progress * Math.PI * 16)) * amplitude * 0.25;
        case 'ambient':
            return Math.sin(progress * Math.PI * 2) * amplitude * 0.15;
        default:
            return 0;
    }
}

function initializeAudioPlayer() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const downloadBtn = document.getElementById('download-btn');

    let isPlaying = false;
    let audioContext;
    let oscillator;

    playBtn.addEventListener('click', function() {
        if (!isPlaying) {
            playGeneratedAudio();
            isPlaying = true;
            animateWaveform();
        }
    });

    pauseBtn.addEventListener('click', function() {
        if (isPlaying && oscillator) {
            oscillator.stop();
            isPlaying = false;
        }
    });

    stopBtn.addEventListener('click', function() {
        if (oscillator) {
            oscillator.stop();
            isPlaying = false;
        }
        resetWaveform();
    });

    downloadBtn.addEventListener('click', function() {
        downloadComposition();
    });

    function playGeneratedAudio() {
        // Create audio context for demonstration
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const genre = document.getElementById('genre').value;
        const tempo = document.getElementById('tempo').value;
        const complexity = document.getElementById('complexity').value;

        // Generate simple audio based on parameters
        oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Set frequency based on genre
        const baseFreq = getGenreFrequency(genre);
        oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        
        // Modulate based on complexity
        oscillator.frequency.exponentialRampToValueAtTime(
            baseFreq * (1 + complexity * 0.2), 
            audioContext.currentTime + 2
        );

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 5);

        oscillator.type = getGenreWaveType(genre);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 5);

        oscillator.onended = function() {
            isPlaying = false;
        };
    }

    function getGenreFrequency(genre) {
        const frequencies = {
            classical: 440,
            jazz: 330,
            electronic: 880,
            ambient: 220
        };
        return frequencies[genre] || 440;
    }

    function getGenreWaveType(genre) {
        const waveTypes = {
            classical: 'sine',
            jazz: 'triangle',
            electronic: 'square',
            ambient: 'sine'
        };
        return waveTypes[genre] || 'sine';
    }

    function animateWaveform() {
        const canvas = document.getElementById('waveform');
        const ctx = canvas.getContext('2d');
        let frame = 0;

        function animate() {
            if (!isPlaying) return;

            // Add moving highlight
            ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
            ctx.fillRect((frame * 2) % canvas.width, 0, 20, canvas.height);

            frame++;
            requestAnimationFrame(animate);
        }
        animate();
    }

    function resetWaveform() {
        const genre = document.getElementById('genre').value;
        const tempo = document.getElementById('tempo').value;
        const complexity = document.getElementById('complexity').value;
        generateWaveform(genre, tempo, complexity);
    }

    function downloadComposition() {
        const genre = document.getElementById('genre').value;
        const tempo = document.getElementById('tempo').value;
        const complexity = document.getElementById('complexity').value;
        
        // Create download blob (simulated MIDI data)
        const midiData = generateMIDIData(genre, tempo, complexity);
        const blob = new Blob([midiData], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-composition-${genre}-${tempo}bpm.mid`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Composition downloaded!');
    }
}

function generateMIDIData(genre, tempo, complexity) {
    // Simplified MIDI-like data generation
    const header = 'MThd\x00\x00\x00\x06\x00\x00\x00\x01\x00\x60';
    const trackHeader = 'MTrk\x00\x00\x00\x3B';
    const notes = generateNoteSequence(genre, tempo, complexity);
    return header + trackHeader + notes;
}

function generateNoteSequence(genre, tempo, complexity) {
    // Generate a simple note sequence based on parameters
    let sequence = '';
    const noteCount = Math.floor(complexity * 20);
    
    for (let i = 0; i < noteCount; i++) {
        const note = getGenreNote(genre, i);
        const velocity = Math.floor(Math.random() * 127);
        const timing = Math.floor((60000 / tempo) * Math.random());
        
        sequence += String.fromCharCode(timing % 256, 0x90, note, velocity);
    }
    
    return sequence;
}

function getGenreNote(genre, index) {
    const scales = {
        classical: [60, 62, 64, 65, 67, 69, 71, 72], // C major
        jazz: [60, 62, 63, 65, 67, 69, 70, 72], // C blues
        electronic: [60, 63, 65, 67, 70, 72, 75, 77], // C minor pentatonic
        ambient: [60, 62, 64, 67, 69, 72, 74, 76] // C major pentatonic
    };
    
    const scale = scales[genre] || scales.classical;
    return scale[index % scale.length];
}

function initializeCompositionPlayer() {
    const playButtons = document.querySelectorAll('.play-composition');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const track = this.getAttribute('data-track');
            playPresetComposition(track, this);
        });
    });
}

function playPresetComposition(track, button) {
    const originalText = button.textContent;
    button.textContent = '⏸️ Playing';
    button.disabled = true;

    // Simulate playing preset composition
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        showNotification(`Finished playing ${track} composition`);
    }, 3000);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(45deg, #00d4ff, #ff006e)',
        color: '#000',
        padding: '1rem 2rem',
        borderRadius: '25px',
        fontFamily: 'Orbitron, monospace',
        fontWeight: 'bold',
        zIndex: '10000',
        boxShadow: '0 10px 30px rgba(0, 212, 255, 0.3)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

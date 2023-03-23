(async () => {
    let volumeCallback = null;
    let volumeInterval = null;
    //const volumeVisualizer = document.getElementById('volume-visualizer');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true
            }
        });
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.minDecibels = -120;
        analyser.maxDecibels = 0;
        analyser.smoothingTimeConstant = 0.4;
        audioSource.connect(analyser);
        const volumes = new Uint8Array(analyser.frequencyBinCount);
        const sound = document.querySelector('#sound')
        volumeCallback = () => {
            console.log(volumes[0]);
            if (volumes[0] > 100) {
                sound.classList.add('active')
            } else {
                sound.classList.remove('active')
            }
            analyser.getByteFrequencyData(volumes);
            let volumeSum = 0;
            for (const volume of volumes)
                volumeSum += volume;
            const averageVolume = volumeSum / volumes.length;
            /* volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%'); */
        };
    }
    catch (e) {
        console.log(err);
    }

    startButton.addEventListener('click', () => {
        if (volumeCallback !== null && volumeInterval === null)
            volumeInterval = setInterval(volumeCallback, 100);
    });
    stopButton.addEventListener('click', () => {
        if (volumeInterval !== null) {
            clearInterval(volumeInterval);
            volumeInterval = null;
        }
    });
})();
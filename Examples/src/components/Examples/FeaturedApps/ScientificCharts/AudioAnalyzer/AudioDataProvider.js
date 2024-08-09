import { AudioData } from "./AudioData";
export class AudioDataProvider {
    sampleRateProperty;
    bufferSizeProperty; // should be with power of 2 for correct work of FFT
    audioContext = null;
    inputPoint = null;
    streamSource = null;
    analyserNode = null;
    zeroGain = null;
    initializedProperty = false;
    isDeletedProperty = false;
    audioData;
    time = 0;
    freqByteData;
    permissionError;
    constructor(sampleRate = 44100, bufferSizeProperty = 2048) {
        this.sampleRateProperty = sampleRate;
        this.bufferSizeProperty = bufferSizeProperty;
        this.audioData = new AudioData(bufferSizeProperty);
    }
    get initialized() {
        return this.initializedProperty;
    }
    get isDeleted() {
        return this.isDeletedProperty;
    }
    get bufferSize() {
        return this.bufferSizeProperty;
    }
    get sampleRate() {
        return this.sampleRateProperty;
    }
    async initAudio() {
        try {
            const constraints = { audio: true, video: false };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            // @ts-ignore
            const AudioContextClass = window.AudioContext || window.webkitAudioContext || false;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            } else {
                throw Error("AudioContextClass is not defined");
            }
            this.inputPoint = this.audioContext.createGain();
            // Create an AudioNode from the stream.
            this.streamSource = this.audioContext.createMediaStreamSource(stream);
            this.streamSource.connect(this.inputPoint);
            this.analyserNode = this.audioContext.createAnalyser();
            this.analyserNode.fftSize = this.bufferSizeProperty * 2;
            this.inputPoint.connect(this.analyserNode);
            this.zeroGain = this.audioContext.createGain();
            this.zeroGain.gain.value = 0.0;
            this.inputPoint.connect(this.zeroGain);
            this.zeroGain.connect(this.audioContext.destination);
            this.freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
            this.initializedProperty = true;
            return true;
        } catch (error) {
            //@ts-ignore
            if (error.name === "NotAllowedError") {
                this.permissionError = true;
            }
            console.warn("Error getting audio", error);
            return false;
        }
    }
    closeAudio() {
        this.audioContext?.close();
        this.audioContext = null;
        this.inputPoint = null;
        this.streamSource = null;
        this.zeroGain = null;
        this.audioData = null;
        this.freqByteData = null;
        this.initializedProperty = false;
        this.isDeletedProperty = true;
    }
    next() {
        if (this.initialized === false) {
            throw new Error("Audio isn't initialized!");
        }
        this.analyserNode.getByteTimeDomainData(this.freqByteData);
        for (let i = 0; i < this.bufferSizeProperty; i++) {
            this.audioData.xData[i] = this.time++;
            // Convert 8-bit unsigned integer to 16-bit signed integer,
            // so that values are in range expected for Radix2FFT
            this.audioData.yData[i] = (this.freqByteData[i] / 255) * 65535 - 32768;
        }
        return this.audioData;
    }
}

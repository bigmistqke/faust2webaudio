# Faust2WebAudio

The repository is now maintained by [Grame-CNCM](https://github.com/grame-cncm/faust2webaudio). Please check that fork for the latest version.

Produces a ScriptProcessorNode or an AudioWorkletNode with Faust .dsp code using the libfaust WebAssembly compiler.

Supported Platforms: Chrome >= 49, Firefox >= 45, Edge >= 13, Safari >= 10, iOS >= 10, Android >= 68

## Testing

Clone a copy of the repo:

```bash
git clone https://github.com/grame-cncm/faust2webaudio
```
Put the directory in a local server, then open following pages:

For Mono ScriptProcessor: `./test/mono.html`

For Poly ScriptProcessor: `./test/poly.html`

For Mono AudioWorklet: `./test/wmono.html`

For Poly AudioWorklet: `./test/wpoly.html`

## Installing as npm package

```bash
npm install -D grame-cncm/faust2webaudio
```

Example: 

```JavaScript
import { Faust } from "faust2webaudio";

// Initialise Web Audio context
const audioContext = new window.AudioContext();

// Define Faust programs to run
const monoCode = `
import("stdfaust.lib");
process = ba.pulsen(1, 10000) : pm.djembe(60, 0.3, 0.4, 1) <: dm.freeverb_demo;`;

const polyCode = `
import("stdfaust.lib");
process = ba.pulsen(1, 10000) : pm.djembe(ba.hz2midikey(freq), 0.3, 0.4, 1) * gate * gain with {
    freq = hslider("freq", 440, 40, 8000, 1);
    gain = hslider("gain", 0.5, 0, 1, 0.01);
    gate = button("gate");
};
effect = dm.freeverb_demo;`;

// Set up Faust compiler
const faust = new Faust({
    // Update the below paths with the locations of the necessary files!
    // They can be found inside the Node module, under the 'dist' directory.
    wasmLocation: "path/to/libfaust-wasm.wasm",
    dataLocation: "path/to/libfaust-wasm.data"
});

// Ensure that the compiler is ready before continuing
await faust.ready;

// Compile monophonic code and connect the generated Web Audio node to the output.
const monoNode = await faust.getNode(polyCode, {
    audioCtx: audioContext,
    useWorklet: window.AudioWorklet ? true : false,
    args: { "-I": "libraries/" }
});
monoNode.connect(audioContext.destination);

// Compile polyphonic code and connect the generated Web Audio node to the output.
const polyNode = await faust.getNode(polyCode, {
    audioCtx: audioContext,
    useWorklet: window.AudioWorklet ? true : false,
    voices: 4,
    args: { "-I": "libraries/" }
});
polyNode.connect(audioContext.destination);
```

Windows users: Ensure that your copy of `libfaust-wasm.data` is terminated with LF line endings and not CRLF! If you have problems, try replacing it with a copy downloaded directly from [this repository](dist/libfaust-wasm.data).

## Building

Firstly ensure that you have [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/) installed.

Clone a copy of the repo then change to the directory:

```bash
git clone https://github.com/grame-cncm/faust2webaudio
cd faust2webaudio
```
Install dev dependencies:

```bash
npm install
```

Possibly:

```bash
npm update
```

To upgrade Libfaust version: replace `src/libfaust-wasm.js`, `dist/libfaust-wasm.wasm` and `dist/libfaust-wasm.data` with the new files

To build everything (using Webpack 4, Babel 7, TypeScript), this will produce `dist/index.js` and `dist/index.min.js` (this command must be done before commit + push on GitHub):
```bash
npm run dist
```

If you don't want to build the minified js for testing purpose:
```bash
npm run build
```
To test, put the directory in a local server, then open the following pages:

For Mono ScriptProcessor: `./test/mono.html`
For Poly ScriptProcessor: `./test/poly.html`
For Mono AudioWorklet: `./test/wmono.html`
For Poly AudioWorklet: `./test/wpoly.html`

## Versioning 

You'll have to raise the package version number in `package.json` for `npm run update` to properly work.



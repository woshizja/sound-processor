> forgive my poor English...

# sound-processor

A small(gzip < 3KB), dependency-free audio signal processor, the flow is:

1. import original audio signal;
2. gaussian filter，make output more smooth;

> when you `getByteFrequencyData` from `AnalyserNode`, webaudio has already apply a [Blackman window](https://webaudio.github.io/web-audio-api/#fft-windowing-and-smoothing-over-time), make up for [gain loss](https://en.wikipedia.org/wiki/Window_function#Processing_gain_and_losses), the parameters is unadjustable. But most of the time, the vision is prior to precision in audio visualization, so we apply a gaussian filter for signal smooth, the degree of smoothness is steerable.

3. weighting, include a-weighting and time-weighting. weighting simulate human subjective feeling of sound;
4. octave divide base on parameters given to `SoundProcessor`;


three demo（audio is load slow, please wait）：
- [demo1](https://woshizja.github.io/sound-processor/public/bar.html)；

![bar](https://p1.music.126.net/2cVN96NvtkhWoRXqYbMk6A==/109951164111107853.gif)

- [demo2](https://woshizja.github.io/sound-processor/public/circle.html)；

![circle](https://p1.music.126.net/ZOX9Un-PjLGmkMhsj9mqhw==/109951164111111781.gif)

- [demo3](https://woshizja.github.io/sound-processor/public/dot.html)；

![dot](https://p1.music.126.net/YWfVwL7DQYCvQLBfeCJefQ==/109951164111118060.gif)


### install
```
npm install sound-processor
```

### usage
``` javascript
import { SoundProcessor } from "sound-processor";

const processor = new SoundProcessor(options);
// in means original signal from getByteFrequencyData
const out = processor.process(in);
```

### options
- `filterParams`: gaussian filter params，`object`，default to `undefined`，means **do not** filter：
    - `sigma`：gaussian distribution sigma，default to 1，means **standardized normal distribution**, bigger sigma means more smooth，usually between `0.1~250`;
    - `radius`：filter radius, default to 2, bigger means more smooth；
- `sampleRate`：from `audioContext.sampleRate`, like 48000；
- `fftSize`：param for FFT，default to 1024；
- `startFrequency`：min frequency，default 0；
- `endFrequency`：max frequency，default to 10000，you can cut out any frequency section with `startFrequency` and `endFrequency`；
- `outBandsQty`：number of output bands, usually means number of visualization targets;
- `tWeight`：whether to apply time-weighting，default to `false`;
- `aWeight`：whether to apply time-weighting，default to `true`;

### frequency cut
frequency of music is between `50~10000 Hz`, but in practice, we can cut `100~7000 Hz`. perfect frequency cut not exists.

### contribution
clone this project，exchange content of `package.json` and `package.dev.json`, than `npm run start`.

### license
MIT.
# sound-processor

一个极小（gzip < 3KB）的处理音频信号的库，作为**音频可视化**的底层部分，使用相对科学的方法处理原始音频信号并输出符合人类主观听觉的信号，内部的处理流程如下：

1. 输入原始信号；
2. 滤波，采用高斯滤波，目的在于滤除**突刺**，是信号更加平滑；

> webaudio 本身会应用一个 [blackman window](https://webaudio.github.io/web-audio-api/#fft-windowing-and-smoothing-over-time)，这个窗函数的作用是消除DFT造成的信号畸变和能量泄漏，其参数都是不可设置的。增加一个[高斯滤波](https://en.wikipedia.org/wiki/Normal_distribution)的作用在于进一步平滑信号，是服务于可视化效果的（很多时候视觉的重要性是要先于准确性的）。

3. 时间计权，记录五次历史的平均值；

> webaudio 自带了一个平滑参数：[smoothingTimeConstant](https://webaudio.github.io/web-audio-api/#dom-analysernode-smoothingtimeconstant)，其内部采用了连续两帧的数据：

![平滑公式](https://p1.music.126.net/p1gj68f6i2v83KWKGv12-w==/109951164110151095.jpg)

4. [A计权](https://www.noisemeters.com/help/faq/frequency-weighting/)，模拟人对不同频率声音的主观感受；
5. 频带划分，遵循倍频程的算式；

三个示例：
- [demo1](https://woshizja.github.io/sound-processor/public/bar.html)；

![bar](https://p1.music.126.net/-SE6SyLpr8I1iGRWWkiatg==/109951164110182590.gif)

- [demo2](https://woshizja.github.io/sound-processor/public/circle.html)；

![circle](https://p1.music.126.net/YSARkTCdYGw1JCA7HaKZwg==/109951164110179680.gif)

- [demo3](https://woshizja.github.io/sound-processor/public/dot.html)；

![dot](https://p1.music.126.net/1g2twhCkzo-494EFpqpnAA==/109951164110177742.gif)

### 安装
```
npm install sound-processor
```

### 使用
``` javascript
import { SoundProcessor } from "sound-processor";

const processor = new SoundProcessor(options);
// in means original signal
const out = processor.process(in);
```

### options
- `filterParams`: 滤波参数，对象，默认`undefined`，表示不滤波：
    - `sigma`：高斯分布的sigma参数，默认为1，表示标准正态分布，sigma越大平滑效果越明显，一般取`0.1~250`之间；
    - `radius`：滤波半径，默认为2；
- `sampleRate`：采样率，可以从webaudio的context中取（`audioContext.sampleRate`），一般是48000；
- `fftSize`：傅里叶变换参数，默认为1024；
- `startFrequency`：起始频率，默认为0；
- `endFrequency`：截止频率，默认10000，配合`startFrequency`可以选取任意频段的信号；
- `outBandsQty`：输出频带数，对应可视化目标的数量，默认为`fftSize`的一半；
- `tWeight`：是否开启时间计权，默认为`false`；
- `aWeight`：是否开启A计权，默认为`true`；

### 频率截取
一般音乐的频率范围在`50~10000 Hz`之间，实际中可以取的小一些，比如`100~7000 Hz`，对于不同风格以及不同乐器的声音很难取到一个统一的完美区间，另外不同的视觉风格可能也会影响频率区间。

### 贡献
clone工程到本地，交换`package.json`与`package.dev.json`的内容，然后运行`npm run start`;

### license
MIT.
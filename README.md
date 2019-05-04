# sound-processor

一个极小（gzip < 3KB）的处理音频信号的库，使用相对科学的方法处理原始音频信号，输出符合人类听觉的信号，目标是作为**音频可视化**的基础支撑，内部大概的处理流程如下：

1. 输入原始信号；
2. 滤波，采用高斯滤波，目的在于滤除**突刺**；
3. 时间计权，记录五次历史的平均值；
4. A计权，模拟人对不同频率声音的主观感受；
5. 频带划分，遵循倍频程的算式；

三个示例：
- [demo1](https://woshizja.github.io/sound-processor/public/bar.html)；
- [demo2](https://woshizja.github.io/sound-processor/public/circle.html)；
- [demo3](https://woshizja.github.io/sound-processor/public/dot.html)；

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
- `filterParams`: 滤波参数，对象：
    - `sigma`：高斯分布的sigma参数，默认为1，表示标准正态分布；
    - `radius`：滤波半径，默认为0，表示不滤波；
- `sampleRate`：采样率，可以从webaudio的context中取（`audioContext.sampleRate`），一般是48000；
- `fftSize`：傅里叶变换参数，默认为1024；
- `startFrequency`：起始频率，默认为0；
- `endFrequency`：截止频率，默认10000，配合`startFrequency`可以选取任意频段的信号；
- `outBandsQty`：输出频带数，对应可视化目标的数量，默认为`fftSize`的一半；
- `tWeight`：是否开启时间计权，默认为`false`；
- `aWeight`：是否开启A计权，默认为`true`；


### 贡献
交换`package.json`与`package.dev.json`的内容，然后运行`npm run start`;

### license
MIT.
import { aWeighting, gauss } from './util.js';


class SoundProcessor {
    constructor(options = {}) {
        const {
            filterParams = {},
            sampleRate,
            fftSize,
            endFrequency,
            startFrequency,
            outBandsQty
        } = options;

        if(!fftSize || !sampleRate || !outBandsQty) {
            throw new Error('need fftSize, sampleRate and outBandsQty');
        }
        
        this.sampleRate = sampleRate; // 采样率
        this.fftSize = fftSize; // fftSize
        this.bandsQty = Math.floor(fftSize / 2); // 频带数
        this.outBandsQty = outBandsQty; // 输出的频带数
        this.bandwidth = sampleRate / fftSize; // 带宽
        this.startFrequency = startFrequency || 0;
        this.endFrequency = endFrequency || sampleRate;
        
        // 默认标准正态分布: N(0, 1)
        this.filterParams = {
            mu: 0, // 固定为0
            sigma: filterParams.sigma || 1,
            kernelRadius: filterParams.kernelRadius || 2,
        };

        this.aWeights = [];
        this.bands = [];
        this.gKernel = [];
        
        this.historyLimit = 5;
        this.history = [];

        this.initWeights();
        this.initBands();
        this.initGaussKernel();

        this.process = this.process.bind(this);
    }

    initWeights() {
        const {
            bandwidth,
            bandsQty,
            aWeights
        } = this;
    
        for (let i = 0; i < bandsQty; i++) {
            aWeights.push(aWeighting(i * bandwidth));
        }
    }

    initBands() {
        const {
            endFrequency,
            startFrequency,
            outBandsQty,
            bands
        } = this;
    
        // 根据起止频谱、频带数量确定倍频数: N
        // fu = 2^(1/N)*fl  => n = 1/N = log2(fu/fl) / bandsQty
        let n = Math.log2(endFrequency / startFrequency) / outBandsQty;
        n = Math.pow(2, n);  // n = 2^(1/N)
    
        const nextBand = {
            lowerFrequency: Math.max(startFrequency, 0),
            upperFrequency: 0
        };
    
        for (let i = 0; i < outBandsQty; i++) {
            // 频带的上频点是下频点的2^n倍
            const upperFrequency = nextBand.lowerFrequency * n;
            nextBand.upperFrequency = Math.min(upperFrequency, endFrequency);
    
            bands.push({
                lowerFrequency: nextBand.lowerFrequency,
                upperFrequency: nextBand.upperFrequency
            });
            nextBand.lowerFrequency = upperFrequency;
        }
    }

    initGaussKernel() {
        const {
            filterParams,
            gKernel
        } = this;

        const {
            mu,
            sigma,
            kernelRadius
        } = filterParams;

        const radius = kernelRadius;

        for(let i = -radius; i < 1; i++) {
            // 95%置信区间内均分
            gKernel.push(gauss(i, sigma, mu));
        }

        for(let i = radius - 1; i > -1; i--) {
            // 对称
            gKernel.push(gKernel[i]);
        }

        this.gKernelSum = gKernel.reduce((prev, curr) => {
            return prev + curr
        });
        this.kernelRadius = kernelRadius;

        console.log(gKernel)
    }

    filter(frequencies) {
        const {
            gKernel,
            gKernelSum,
            kernelRadius
        } = this;

        // 计权：卷积
        for (let i = 0; i < frequencies.length; i++) {
            // if (i < kernelRadius || i > frequencies.length - kernelRadius) {
            //     continue;
            // }

            let count = 0;
            for (let j = i - kernelRadius; j < i + kernelRadius; j++) {
                const value =  frequencies[j] !== undefined ? frequencies[j] : 0;
                count += value * gKernel[j - i + kernelRadius];
            }

            frequencies[i] = (count / gKernelSum);
        }
    }

    weighting(frequencies) {
        const {aWeights} = this;

        for(let i = 0; i < frequencies.length; i++) {
            if(aWeights[i] !== undefined) {
                frequencies[i] = frequencies[i] * aWeights[i];
            }
        }
    }

    generateSpectrums(frequencies) {
        const {
            outBandsQty,
            bandwidth,
            bands
        } = this; 
        const temp = new Array(outBandsQty);

        for (let i = 0; i < bands.length; i++) {
            const band = bands[i];
            const startIndex = Math.floor(band.lowerFrequency / bandwidth);
            const endIndex = Math.min(
                Math.floor(band.upperFrequency / bandwidth),
                frequencies.length - 1
            );
            
            let count = 0;
            // 均方值
            for(let i = startIndex; i <= endIndex; i++) {
                count += frequencies[i] * frequencies[i];
            }
            temp[i] = Math.sqrt(count / (endIndex + 1 - startIndex));
    
            // 找最大
            // temp.push(
            //     Math.max.apply(this, amplitudes.slice(startIndex, endIndex + 1))
            // );
        }
        return temp;
    }

    timeAvg(frequencies) {
        const {
            history,
            historyLimit
        } = this;

        if(history.length < 5) {
            history.push(frequencies.slice(0));
        } else {
            history.pop();
            history.unshift(frequencies.slice(0));
            for(let i = 0; i < frequencies.length; i++) {
                let count = 0;
                for(let j = 0; j < historyLimit; j++) {
                    count += history[j][i] / historyLimit;
                }
                frequencies[i] = count;
            }
        }
    }

    process(frequencies) {
        // 1. 计权
        // 2. 频谱
        // 3. 滤波
        // this.weighting(frequencies);
        // const temp = this.generateSpectrums(frequencies);
        // this.filter(temp);

        this.timeAvg(frequencies);
        this.filter(frequencies);
        this.weighting(frequencies);
        const temp = this.generateSpectrums(frequencies);
        
        return temp;
    }
}

export {
    SoundProcessor
}; 
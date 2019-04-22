/**
 * A计权
 * @param {number} 频率
 * return weighting
 */
function aWeighting (f) {
	const f2 = f*f;
	return 1.2588966 * 148840000 * f2*f2 /
	((f2 + 424.36) * Math.sqrt((f2 + 11599.29) * (f2 + 544496.41)) * (f2 + 148840000));
}

/**
 * 高斯公式
 * @param {number} x 
 * @param {number} sigma 
 * @param {number} mu 
 */
function gauss(x, sigma = 1, mu = 0) {
    return Math.pow(Math.E, -(Math.pow(x - mu, 2) / (2 * sigma * sigma)));
}

export {
    aWeighting,
    gauss
}

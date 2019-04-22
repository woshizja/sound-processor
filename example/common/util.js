/**
 * Reduce un array al tamaño deseado haciendo la media
 * de las partes que quedan.
 *
 * Ejemplo para tamaño 2:
 * [1, 1, 2, 2] => [1, 2]
 * [2, 4, 5, 5] => [3, 5]
 */
function reduce(array, size) {
    if (size >= array.length) {
        return array;
    }
    const newArray = [],
        step = parseInt(array.length / size, 10);

    for (let i = 0; i < array.length; i += step) {
        let sum = 0;
        for (let j = 0; j < step && (i + j) < array.length; j++) {
            sum += array[i + j];
        }
        newArray.push(parseInt(sum / step, 10));
    }

    return newArray;
}

export {
    reduce
}
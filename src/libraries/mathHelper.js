export function getMean(numArrOrObjArr, fieldName = null) {
    if (fieldName) {
        return getRound(numArrOrObjArr.reduce((a, b) => a + b[fieldName], 0) / numArrOrObjArr.length, 2);
    } else {
        return getRound(numArrOrObjArr.reduce((a, b) => a + b) / numArrOrObjArr.length, 2);
    }
}

export function getStandardDeviation(array) {
    const mean = getMean(array);
    const sd = Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / array.length);
    return getRound(sd, 2);
}

export function getRound(num, digit) {
    const x = Math.pow(10, digit);
    return Math.round(num * x) / x;
}

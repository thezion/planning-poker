export function createChartData(array, xOptions, yOptions) {
    const output = {
        labels: array.map((item) => {
            return typeof xOptions.transformer === 'function'
                ? xOptions.transformer(item[xOptions.key])
                : item[xOptions.key];
        }),
        datasets: [
            {
                label: 'Standard Deviation',
                data: array.map((item) => {
                    return typeof yOptions.transformer === 'function'
                        ? yOptions.transformer(item[yOptions.key])
                        : item[yOptions.key];
                }),
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    return output;
}

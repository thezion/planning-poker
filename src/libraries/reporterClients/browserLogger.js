const browserLogger = {
    prod: process.env.NODE_ENV === 'production',
    log: function (msg) {
        if (!this.prod) console.log(msg);
    },
};

export default browserLogger;

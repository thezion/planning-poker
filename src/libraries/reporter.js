class Reporter {
    constructor(client) {
        this.client = client;
    }

    log(msg) {
        this.client.log(msg);
    }
}

const browserLogger = {
    prod: process.env.NODE_ENV === 'production',
    log: function (msg) {
        if (!this.prod) console.log(msg);
    },
};

const reporter = new Reporter(browserLogger);

export default reporter;

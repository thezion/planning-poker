import browserLogger from './reporterClients/browserLogger';

class Reporter {
    constructor(client) {
        this.client = client;
    }

    log(msg) {
        this.client.log(msg);
    }
}

const reporter = new Reporter(browserLogger);

export default reporter;

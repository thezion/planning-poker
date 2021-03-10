const handler = require('./index').handler;

const response = handler({
    queryStringParameters: {
        sessionName: 'john',
    },
});

response.then((res) => console.log(res)).catch((err) => console.error(err));

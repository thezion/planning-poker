const axios = require('axios').default;

exports.handler = async (event) => {
    // parse event
    const sessionName = event.queryStringParameters.sessionName;

    // elasticsearch
    const url = 'https://REPLACE_URL_HERE';
    const query = {
        query: { term: { room: sessionName } },
        size: 100,
        sort: [{ _id: { order: 'desc' } }],
    };

    // request data
    try {
        const res = await axios.post(url, query);
        return {
            statusCode: 200,
            body: JSON.stringify(
                (res.data.hits.hits || []).map((item) => {
                    return item._source;
                })
            ),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: {
                status: 'error',
                message: err.message,
            },
        };
    }
};

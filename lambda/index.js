const axios = require('axios').default;

exports.handler = async (event) => {
    // parse event
    const sessionName = event.queryStringParameters.sessionName;

    // elasticsearch
    const url = `https://____:____@planning-poker-3350690858.us-east-1.bonsaisearch.net:443/planning-poker/_doc/_search`;
    const query = {
        size: 100,
        sort: [{ _id: { order: 'desc' } }],
    };
    if (sessionName) {
        query.query = { term: { room: sessionName } };
    }

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

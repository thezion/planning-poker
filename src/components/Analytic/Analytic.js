import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { getStandardDeviation, getMean } from '../../libraries/mathHelper';
import reporter from '../../libraries/reporter';
import { createChartData } from '../../libraries/chartHelper';

const chartOptions = {
    scales: {
        yAxes: [{ ticks: { beginAtZero: true, display: false } }],
    },
    maintainAspectRatio: false,
};

function Analytic({ sessionName }) {
    reporter.log('Analytic render()');

    // state
    const [historyData, setHistoryData] = useState([]);

    // fetch data
    useEffect(() => {
        fetch(process.env.REACT_APP_ANALYTICS_URL + sessionName)
            .then((response) => response.json())
            .then((json) => {
                const data = json.map((item) => {
                    item.sd = getStandardDeviation(item.points);
                    return item;
                });
                setHistoryData(data);
            });
    }, [sessionName]);

    if (historyData.length === 0) {
        return (
            <div className="text-center">
                No data. This is powered by a Lambda function which has a delay due to cold start.
            </div>
        );
    }

    const sdComparation = {
        last20Votes: getMean(historyData.slice(0, 20), 'sd'),
        last50Votes: getMean(historyData.slice(0, 50), 'sd'),
        last100Votes: getMean(historyData.slice(0, 100), 'sd'),
    };
    const chartDate = createChartData(
        historyData.slice(0, 20).reverse(),
        { key: 'time', transformer: (value) => value.substr(5, 5) },
        { key: 'sd' }
    );

    const tableRows = historyData.map((item) => {
        return (
            <tr key={item.time}>
                <td>{new Date(item.time).toLocaleString()}</td>
                <td>{item.points.join(' , ')}</td>
                <td>{item.sd}</td>
            </tr>
        );
    });

    return (
        <div>
            <div className="text-center mb-3">
                <div>Mean Standard Deviation: reflects the team's disagreement - the lower, the better</div>
                <div>
                    Last 20 Votes
                    <span
                        className={`badge bg-${
                            sdComparation.last20Votes > sdComparation.last50Votes ? 'danger' : 'success'
                        } rounded-pill mx-2`}
                    >
                        {sdComparation.last20Votes}
                    </span>
                    Last 50 Votes
                    <span className="badge bg-secondary rounded-pill mx-2">{sdComparation.last50Votes}</span>
                    Last 100 Votes
                    <span className="badge bg-secondary rounded-pill mx-2">{sdComparation.last100Votes}</span>
                </div>
            </div>
            <div className="mb-3">
                <Line data={chartDate} options={chartOptions} height={150} />
            </div>
            <table className="table table-dark table-striped text-center">
                <thead>
                    <tr className="text-light">
                        <th scope="col">Date &amp; Time</th>
                        <th scope="col">Votes @{sessionName}</th>
                        <th scope="col">Standard Deviation</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </div>
    );
}

Analytic.propTypes = {
    sessionName: PropTypes.string,
};

export default React.memo(Analytic);

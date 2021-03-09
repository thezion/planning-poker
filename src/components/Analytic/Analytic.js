import { useState, useEffect } from 'react';
import { getStandardDeviation, getMean } from '../../libraries/mathHelper';

function Analytic({ sessionName }) {
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
        return <div className="text-center">No data.</div>;
    }

    const sdComparation = {
        last20Votes: getMean(historyData.slice(0, 20), 'sd'),
        last50Votes: getMean(historyData.slice(0, 50), 'sd'),
        last100Votes: getMean(historyData.slice(0, 100), 'sd'),
    };

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
                <div>Average Standard Deviation: reflects the consensus - the lower, the better</div>
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
            <table class="table table-dark table-striped text-center">
                <thead>
                    <tr className="text-light">
                        <th scope="col">Time</th>
                        <th scope="col">Votes</th>
                        <th scope="col">Standard Deviation</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </div>
    );
}

export default Analytic;

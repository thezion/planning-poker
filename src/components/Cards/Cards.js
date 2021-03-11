import React from 'react';
import PropTypes from 'prop-types';

import db from 'libraries/database';
import './Cards.scss';

const points = [0.5, 1, 2, 3, 5, 8, 13, -1];

function Cards({ userPoint, showPoints }) {
    const pokers = points.map((point) => {
        return (
            <a
                key={point}
                className={`__cards__card ${userPoint === point ? '__cards__card--active' : ''}`}
                onClick={() => db.setPoint(point, userPoint !== point && showPoints)}
                onContextMenu={() => {}}
            >
                <img className="position-relative" src={`img/${point}.png`} alt={point} />
            </a>
        );
    });

    return <div className="d-flex justify-content-center __cards">{pokers}</div>;
}

Cards.propTypes = {
    userPoint: PropTypes.number,
    showPoints: PropTypes.bool,
};

export default React.memo(Cards);

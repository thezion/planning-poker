import React from 'react';
import PropTypes from 'prop-types';

import db from 'libraries/database';
import './Cards.scss';
import './TshirtCards.scss';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function TshirtCards({ userPoint, showVotes }) {
    const cards = SIZES.map((size) => (
        <button
            key={size}
            type="button"
            className={`__cards__card __cards__card--tshirt ${userPoint === size ? '__cards__card--active' : ''}`}
            onClick={() => {
                if (userPoint !== size) {
                    db.setPoint(size, showVotes);
                }
            }}
            aria-label={`Vote ${size}`}
            aria-pressed={userPoint === size}
        >
            <span className="__cards__card__label">{size}</span>
        </button>
    ));

    return <div className="d-flex justify-content-center __cards __cards--tshirt">{cards}</div>;
}

TshirtCards.propTypes = {
    userPoint: PropTypes.string,
    showVotes: PropTypes.bool,
};

export default React.memo(TshirtCards);

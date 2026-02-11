import React, { Suspense, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setTrackCheating } from 'store/user';
import Loading from 'components/Utilities/Loading';
import reporter from 'libraries/reporter';

const Analytic = React.lazy(() => import('../Analytic/Analytic'));

function Setting({ mode = 'points' }) {
    reporter.log('Setting render()');
    const dispatch = useDispatch();

    const [analytics, setAnalytics] = useState(false);
    const trackCheating = useSelector((state) => state.user.trackCheating);
    const sessionName = useSelector((state) => state.session.sessionName);
    const showAnalyticsOption = mode !== 'tshirt';

    return (
        <div>
            <div className="mt-5 text-secondary text-center">
                <h4 className="--with-dash">Setting &amp; Help</h4>
                <div className="d-flex justify-content-center">
                    {showAnalyticsOption && (
                        <div className="form-check form-switch mx-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkboxAnalytics"
                                checked={analytics}
                                onChange={(event) => setAnalytics(event.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="checkboxAnalytics">
                                Show analytics
                            </label>
                        </div>
                    )}
                    {showAnalyticsOption && <span className="ms-2 me-3">|</span>}
                    <div className="form-check form-switch mx-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxCheating"
                            checked={trackCheating}
                            onChange={(event) => dispatch(setTrackCheating(event.target.checked))}
                        />
                        <label className="form-check-label" htmlFor="checkboxCheating">
                            Track cheating
                        </label>
                    </div>
                    <div>
                        <span className="ms-2 me-3">|</span>To remove a player, right click the name
                    </div>
                </div>
            </div>

            {showAnalyticsOption && analytics && (
                <Suspense fallback={<Loading />}>
                    <div className="mt-5 text-secondary ">
                        <h4 className="text-center --with-dash">Analytics</h4>
                        <Analytic sessionName={sessionName} />
                    </div>
                </Suspense>
            )}
        </div>
    );
}

export default React.memo(Setting);

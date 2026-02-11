import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Header from 'components/Header/Header';
import SignIn from 'components/SignIn/SignIn';
import Room from 'components/Room/Room';
import Animation from 'components/Animation/index';
import './App.scss';

function App() {
    return (
        <div className="mx-auto shadow position-relative __app">
            <Router>
                <Header />
                <div className="position-relative">
                    <Switch>
                        <Route path="/" exact component={SignIn} />
                        <Route
                            path="/tshirt/:sessionName"
                            render={({ match, location }) => <Room match={match} location={location} mode="tshirt" />}
                        />
                        <Route
                            path="/poker/:sessionName"
                            render={({ match, location }) => <Room match={match} location={location} mode="points" />}
                        />
                        <Route
                            path="/:sessionName"
                            render={({ match, location }) => <Room match={match} location={location} mode="points" />}
                        />
                    </Switch>
                </div>
                <Animation />
            </Router>
        </div>
    );
}

export default App;

import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Header from 'components/Header/Header';
import SignIn from 'components/SignIn/SignIn';
import Room from 'components/Room/Room';
import Confetti from 'components/Animation/Confetti/Confetti';
// import Confetti from 'components/Animation/Fireworks/Fireworks';
import './App.scss';

function App() {
    return (
        <div className="mx-auto shadow position-relative __app">
            <Router>
                <Header />
                <div className="position-relative">
                    <Switch>
                        <Route path="/" exact component={SignIn} />
                        <Route path="/:sessionName" component={Room} />
                    </Switch>
                </div>
                <Confetti />
            </Router>
        </div>
    );
}

export default App;

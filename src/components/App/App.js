import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Header from '../Header/Header';
import SignIn from '../SignIn/SignIn';
import Room from '../Room/Room';
import Confetti from '../Animation/Confetti/Confetti';
// import Confetti from '../Animation/Fireworks/Fireworks';
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

import WithToggle from 'hoc/WithToggle';
import './Fireworks.scss';

function Fireworks() {
    <div className="__fireworks">
        <div className="__fireworks__before"></div>
        <div className="__fireworks__after"></div>
    </div>;
}

export default WithToggle(Fireworks, 'session.confetti');

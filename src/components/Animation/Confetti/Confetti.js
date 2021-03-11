import WithToggle from 'hoc/WithToggle';
import './Confetti.scss';

function Confetti() {
    const pieces = [...Array(20).keys()].map((index) => <div key={index} className="__confetti__piece"></div>);
    return <div className="__confetti">{pieces}</div>;
}

export default WithToggle(Confetti, 'session.confetti');

import { useSelector } from 'react-redux';
import './Fireworks.scss';

function Fireworks() {
    const showConfetti = useSelector((state) => state.session.confetti);

    if (showConfetti) {
        return (
            <div className="__fireworks">
                <div className="__fireworks__before"></div>
                <div className="__fireworks__after"></div>
            </div>
        );
    } else {
        return null;
    }
}

export default Fireworks;

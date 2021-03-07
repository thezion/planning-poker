import { useSelector } from 'react-redux';
import './Confetti.scss';

function Confetti() {
    const showConfetti = useSelector((state) => state.session.confetti);

    if (showConfetti) {
        const pieces = [...Array(20).keys()].map((index) => <div key={index} class="__confetti__piece"></div>);
        return <div class="__confetti">{pieces}</div>;
    } else {
        return null;
    }
}

export default Confetti;

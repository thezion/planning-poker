import './Confetti.scss';

export default function Confetti() {
    const pieces = [...Array(20).keys()].map((index) => <div key={index} className="__confetti__piece"></div>);
    return <div className="__confetti">{pieces}</div>;
}

import React, { useEffect, useState } from 'react';
import './Holiday.scss';

export default function Holiday({ emojis }) {
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        // Create confetti pieces with random properties
        const pieces = Array.from({ length: 24 }, (_, index) => ({
            id: index,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            left: Math.random() * 100, // Random horizontal position
            animationDuration: 2 + Math.random() * 4, // Random fall duration (3-7 seconds)
            animationDelay: Math.random() * 3, // Random start delay
            scale: 0.3 + Math.random() * 0.7, // Random size
        }));

        setConfetti(pieces);
    }, [emojis, setConfetti]);

    return (
        <div className="__holiday-confetti">
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    className="__holiday-confetti__pieces"
                    style={{
                        left: `${piece.left}%`,
                        animationDuration: `${piece.animationDuration}s`,
                        animationDelay: `${piece.animationDelay}s`,
                        transform: `scale(${piece.scale})`,
                    }}
                >
                    {piece.emoji}
                </div>
            ))}
        </div>
    );
}

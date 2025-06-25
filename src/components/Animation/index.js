import Confetti from './Confetti/Confetti';
import Holiday from './Holiday/Holiday';
import WithToggle from '../../hoc/WithToggle';

const holidays = [
    { name: "New Year's Day", emojis: ['🎉', '🎆', '🕐'], date: '2025-01-01' },
    { name: 'Groundhog Day', emojis: ['🦫', '🌤️', '🌨️'], date: '2025-02-02' },
    { name: 'Martin Luther King Jr. Day', emojis: ['✊', '🕊️', '🏛️'], date: '2025-01-20' },
    { name: "Presidents' Day", emojis: ['🇺🇸', '🏛️', '👔'], date: '2025-02-17' },
    { name: "Valentine's Day", emojis: ['💖', '💕', '🌹'], date: '2025-02-14' },
    { name: "St. Patrick's Day", emojis: ['☘️', '🍀', '🍺'], date: '2025-03-17' },
    { name: 'Easter', emojis: ['🐰', '🥚', '🌸'], date: '2025-04-20' },
    { name: 'Memorial Day', emojis: ['🇺🇸', '🌹', '🕊️'], date: '2025-05-26' },
    { name: 'Independence Day', emojis: ['🗽', '🦅', '🎆'], date: '2025-07-04' },
    { name: 'Labor Day', emojis: ['👷', '🏭', '🔧'], date: '2025-09-01' },
    { name: 'Columbus Day', emojis: ['🚢', '🗺️', '🌍'], date: '2025-10-13' },
    { name: 'Halloween', emojis: ['🎃', '👻', '🕷️'], date: '2025-10-31' },
    { name: 'Veterans Day', emojis: ['🇺🇸', '🎖️', '🕊️'], date: '2025-11-11' },
    { name: 'Thanksgiving', emojis: ['🦃', '🍽️', '🫘'], date: '2025-11-27' },
    { name: 'Christmas', emojis: ['🎄', '🎁', '⛄'], date: '2025-12-25' },
];

const DAYS_IN_ADVANCE = 14; // 14 days in advance

function Animation() {
    const today = new Date();
    const fourteenDaysFromNow = new Date(today.getTime() + DAYS_IN_ADVANCE * 24 * 60 * 60 * 1000);

    // Find the next upcoming holiday within 14 days
    const holiday = holidays.find((h) => {
        const holidayDate = new Date(h.date);
        return holidayDate >= today && holidayDate <= fourteenDaysFromNow;
    });

    return holiday ? <Holiday emojis={holiday.emojis} /> : <Confetti />;
}

export default WithToggle(Animation, 'session.confetti');

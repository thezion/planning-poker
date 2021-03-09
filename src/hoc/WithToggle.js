import { useSelector } from 'react-redux';

function WithToggle(WrappedComponent, statePath) {
    const NewComponent = () => {
        const shouldDisplay = useSelector((state) => {
            let value = state;
            statePath.split('.').forEach((key) => (value = value[key]));
            return value;
        });

        return shouldDisplay ? <WrappedComponent /> : null;
    };

    return NewComponent;
}

export default WithToggle;

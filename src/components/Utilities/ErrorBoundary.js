import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div class="alert alert-danger" role="alert">
                    Something went wrong. Open devtools for more info.
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

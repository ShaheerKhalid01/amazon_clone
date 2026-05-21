import React from 'react';

interface ErrorMessageProps {
    error: unknown;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className = '' }) => {
    if (!error) return null;

    const message =
        typeof error === 'string'
            ? error
            : error instanceof Error
                ? error.message
                : 'Something went wrong';

    return (
        <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm ${className}`}>
            ⚠️ {message}
        </div>
    );
};

export default ErrorMessage;
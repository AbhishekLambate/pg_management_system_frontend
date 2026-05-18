import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <input
                className={cn("input-field", className)}
                ref={ref}
                {...props}
            />
            {error && <span className="text-red-400 text-xs">{error}</span>}
        </div>
    );
});

Input.displayName = "Input";

export { Input };

import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'default' ? '' : `btn-${size}`;

    return (
        <button
            ref={ref}
            className={cn("btn", variantClass, sizeClass, className)}
            disabled={props.disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }} />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };

import React, { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const TooltipProvider = ({ children }) => <>{children}</>;

const Tooltip = ({ children }) => {










    return <TooltipContextWrapper>{children}</TooltipContextWrapper>;
};

const TooltipContext = React.createContext({ open: false, setOpen: () => { } });

const TooltipContextWrapper = ({ children }) => {
    const [open, setOpen] = useState(false);
    return (
        <TooltipContext.Provider value={{ open, setOpen }}>
            <div
                className="relative inline-block"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                {children}
            </div>
        </TooltipContext.Provider>
    );
}

const TooltipTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("cursor-pointer", className)} {...props}>
            {children}
        </div>
    );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, children, ...props }, ref) => {
    const { open } = React.useContext(TooltipContext);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

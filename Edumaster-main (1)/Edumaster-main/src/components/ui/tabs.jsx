import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Tabs (wrapper)                                                            */
/* -------------------------------------------------------------------------- */
const Tabs = React.forwardRef(({ className, children, ...props }, ref) => (
    <TabsPrimitive.Root
        ref={ref}
        className={cn("w-full", className)}
        {...props}
    >
        {children}
    </TabsPrimitive.Root>
));
Tabs.displayName = "Tabs";

/* -------------------------------------------------------------------------- */
/*  TabsList                                                                  */
/* -------------------------------------------------------------------------- */
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

/* -------------------------------------------------------------------------- */
/*  TabsTrigger                                                               */
/* -------------------------------------------------------------------------- */
const TabsTrigger = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "data-[state=active]:bg-background data-[state=active]:shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </TabsPrimitive.Trigger>
    )
);
TabsTrigger.displayName = "TabsTrigger";

/* -------------------------------------------------------------------------- */
/*  TabsContent                                                               */
/* -------------------------------------------------------------------------- */
const TabsContent = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <TabsPrimitive.Content
            ref={ref}
            className={cn("mt-2 rounded-md", className)}
            {...props}
        >
            {children}
        </TabsPrimitive.Content>
    )
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };

function DialogContent({
                         className,
                         children,
                         showCloseButton = true,
                         ...props
                       }) {
  React.useEffect(() => {
    // Автоматический скролл к инпуту, если клавиатура его закрывает (iOS fix)
    const inputs = document.querySelectorAll('input, select, textarea');
    const handler = (el) => {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    };

    inputs.forEach((el) => el.addEventListener('focus', () => handler(el)));
    return () =>
        inputs.forEach((el) => el.removeEventListener('focus', () => handler(el)));
  }, []);

  return (
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />

        {/* ✅ scrollable absolute container (fix for iOS keyboard) */}
        <div className="absolute inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
          <DialogPrimitive.Content
              data-slot="dialog-content"
              className={cn(
                  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out " +
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
                  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
                  "grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg " +
                  "duration-200 sm:max-w-lg mt-4 sm:mt-8 mb-[env(safe-area-inset-bottom)]",
                  className
              )}
              {...props}
          >
            {children}

            {showCloseButton && (
                <DialogPrimitive.Close
                    data-slot="dialog-close"
                    className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                >
                  <XIcon />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </div>
      </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props} />
  );
}

function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props} />
  );
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props} />
  );
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

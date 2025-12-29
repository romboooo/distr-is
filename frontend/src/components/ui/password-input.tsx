import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  revealLabel?: string;
  hideLabel?: string;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className, revealLabel = "Show password while pressing", hideLabel = "Hide password", ...props },
    forwardedRef,
  ) => {
    const [isRevealed, setIsRevealed] = React.useState(false);
    const internalRef = React.useRef<HTMLInputElement | null>(null);

    const combineRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
          return;
        }

        if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [forwardedRef],
    );

    const reveal = React.useCallback(() => {
      setIsRevealed(true);
    }, []);

    const conceal = React.useCallback(() => {
      setIsRevealed(false);
    }, []);

    const focusInput = React.useCallback(() => {
      internalRef.current?.focus({ preventScroll: true });
    }, []);

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      focusInput();
      reveal();
    };

    const handlePointerUp = () => {
      conceal();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        reveal();
      }
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        conceal();
      }
    };

    return (
      <div className="relative">
        <Input
          ref={combineRefs}
          type={isRevealed ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onBlur={handlePointerUp}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          aria-pressed={isRevealed}
          aria-label={isRevealed ? hideLabel : revealLabel}
          className="right-0 absolute inset-y-0 flex items-center px-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background text-muted-foreground hover:text-foreground transition-colors"
        >
          {isRevealed ? (
            <EyeOff aria-hidden="true" className="w-4 h-4" />
          ) : (
            <Eye aria-hidden="true" className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

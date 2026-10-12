import * as React from "react";
import { cn } from "cn";

type Variant = "light" | "dark";

interface KeyButtonProps extends React.ComponentProps<"button"> {
  variant?: Variant;
  selected?: boolean;
}

/**
 * A mechanical keyboard-style button with a 3D press animation.
 * Base styles (and animations) come from Uiverse.io by dylanharriscameron,
 * re-tinted for the game theme.
 */
export function KeyButton({
  className,
  variant = "light",
  selected = false,
  type = "button",
  ...props
}: KeyButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "key-btn",
        variant === "dark" && "key-btn--dark",
        selected && "key-btn--selected",
        className,
      )}
      {...props}
    />
  );
}

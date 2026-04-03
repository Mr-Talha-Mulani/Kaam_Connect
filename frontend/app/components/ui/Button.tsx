import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const baseClasses = "min-h-[48px] px-5 py-3 rounded-lg text-base font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out";

  const variantClasses = {
    primary: "bg-primary hover:bg-primary-hover text-white focus:ring-primary",
    secondary: "bg-white border border-border hover:bg-neutral-50 text-neutral-800 focus:ring-primary",
    danger: "bg-error hover:bg-red-600 text-white focus:ring-error",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
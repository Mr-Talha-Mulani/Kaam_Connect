import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ hover = false, className = "", ...props }: CardProps) {
  const baseClasses = "bg-white rounded-2xl shadow-sm border border-neutral-100 p-6";
  const hoverClasses = hover ? "hover:shadow-md transition-shadow duration-200" : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    />
  );
}
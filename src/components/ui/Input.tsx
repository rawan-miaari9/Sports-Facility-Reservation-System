import React, { InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  className = "",
  id,
  ...props
}) => {
  // Fallback ID if none is explicitly provided
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          id={inputId}
          {...props}
          className={`w-full py-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all ${
            Icon ? "pl-10 pr-4" : "px-4"
          } ${className}`}
        />
      </div>
    </div>
  );
};
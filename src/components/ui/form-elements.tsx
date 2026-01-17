"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

// Form Field Wrapper with validation states
interface FormFieldProps {
  label: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  success,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = React.useId();

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "flex items-center gap-1",
          error && "text-destructive"
        )}
      >
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      {React.isValidElement(children) 
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children
      }
      
      {/* Feedback messages */}
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive animate-fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {success}
        </p>
      )}
      {hint && !error && !success && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Info className="h-4 w-4 flex-shrink-0" />
          {hint}
        </p>
      )}
    </div>
  );
}

// Enhanced Input with validation styles
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, success, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "transition-colors duration-200",
          error && "border-destructive focus-visible:ring-destructive/50",
          success && "border-green-500 focus-visible:ring-green-500/50",
          className
        )}
        {...props}
      />
    );
  }
);
FormInput.displayName = "FormInput";

// Enhanced Textarea with validation styles
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, error, success, maxLength, showCount, value, ...props }, ref) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <div className="relative">
        <Textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            "transition-colors duration-200",
            error && "border-destructive focus-visible:ring-destructive/50",
            success && "border-green-500 focus-visible:ring-green-500/50",
            showCount && "pb-6",
            className
          )}
          {...props}
        />
        {showCount && maxLength && (
          <span
            className={cn(
              "absolute bottom-2 right-3 text-xs",
              isOverLimit
                ? "text-destructive"
                : isNearLimit
                ? "text-amber-500"
                : "text-muted-foreground"
            )}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

// Form Section for grouping fields
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// Form Actions (submit/cancel buttons area)
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center" | "between";
}

export function FormActions({
  children,
  className,
  align = "right",
}: FormActionsProps) {
  const alignClasses = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
    between: "justify-between",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 pt-4 border-t",
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

// Password Input with visibility toggle
interface PasswordInputProps extends Omit<FormInputProps, "type"> {
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <FormInput
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// Search Input with clear button
interface SearchInputProps extends Omit<FormInputProps, "type"> {
  onClear?: () => void;
  isLoading?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, isLoading, ...props }, ref) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <FormInput
          ref={ref}
          type="search"
          value={value}
          className={cn("pl-9 pr-9", className)}
          {...props}
        />
        {isLoading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : hasValue && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : null}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

"use client";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";

export default function Input({
  type,
  labelText,
  ...props
}: {
  type?: "text" | "number" | "email" | "password";
  labelText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  const clearText = (event: React.MouseEvent) => {
    event.preventDefault();
    if (ref.current) {
      ref.current.value = "";
      ref.current.focus();
    }
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        clearButtonRef.current &&
        !clearButtonRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (props.value) {
      setIsActive(true);
    }
  }, [props.value]);

  return (
    <div
      className={`relative flex w-full flex-row items-center rounded-md ${isActive ? "bg-white/60 dark:bg-white/[.16]" : "bg-primary"}`}
    >
      <label
        className="text-secondary absolute left-0 top-0 text-nowrap bg-transparent bg-none px-4 text-sm"
        htmlFor={props.id}
      >
        {labelText}
      </label>
      <input
        type={type ?? "text"}
        name={props.name}
        id={props.id}
        value={props.value}
        className={`w-full rounded-md bg-transparent pb-3 pl-4 pr-9 pt-5 outline-none transition placeholder:font-light`}
        required={props.required}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        ref={ref}
        onFocus={handleFocus}
      />
      {isActive && (
        <button
          type="button"
          onClick={clearText}
          className="text-secondary absolute right-0 top-0 pr-4 pt-5"
          ref={clearButtonRef}
        >
          <Cross1Icon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

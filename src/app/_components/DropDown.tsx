"use client";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { useEffect, useRef } from "react";

const DropDownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!children) return null;

  return (
    <div
      ref={dropdownRef}
      className={`dropdown relative flex flex-col items-end ${open ? "open" : ""}`}
    >
      <button
        className="rounded-full bg-white/30 p-2 transition hover:bg-white/60"
        onClick={toggleDropdown}
      >
        <DotsVerticalIcon className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute z-10 mt-10 flex min-w-max flex-col rounded-md bg-white/60 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;

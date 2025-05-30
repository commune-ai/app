 
"use client";

import { useState, useCallback } from "react";
import { WalletOption } from "./types";
import { cn } from "@/app/utils/lib"
;
import Image from "next/image";

interface WalletSelectorProps {
  options: WalletOption[];
  selectedWallet: string;
  onSelect: (walletId: string) => void;
}

export function WalletSelector({ options, selectedWallet, onSelect }: WalletSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback((walletId: string) => {
    onSelect(walletId);
    setIsOpen(false);
  }, [onSelect]);

  // Find the currently selected wallet option
  const selectedOption = options.find((option) => option.id === selectedWallet);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors duration-200 text-white"
      >
        <div className="flex items-center">
          {selectedOption && (
            <Image
              src={selectedOption.icon}
              alt={selectedOption.name}
              width={20}
              height={20}
              className="mr-2"
            />
          )}
          <span>{selectedOption?.name || "Select Wallet"}</span>
        </div>
        <svg
          className={cn("h-5 w-5 transition-transform", isOpen ? "rotate-180" : "")}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-black/90 border border-white/10 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-sm hover:bg-white/10 transition-colors duration-200",
                    selectedWallet === option.id
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-white"
                  )}
                >
                  <Image
                    src={option.icon}
                    alt={option.name}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

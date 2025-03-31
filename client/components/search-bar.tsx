"use client";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  setQuery: (query: string) => void; // Callback to update parent state
}

export function SearchBar({
  placeholder = "Find potential sponsors, partners, or clients in seconds...",
  defaultValue = "",
  setQuery,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <Input
        className="w-full bg-background border-[#343434] rounded-md py-6 px-4 text-sm"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

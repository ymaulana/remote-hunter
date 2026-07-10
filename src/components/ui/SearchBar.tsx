"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "./button";

interface SearchBarProps {
  className?: string;
  variant?: "default" | "minimal";
  onSearch?: (query: { keyword: string }) => void;
}

const SearchBar = ({
  className,
  variant = "default",
  onSearch,
}: SearchBarProps) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-3 md:flex-row",
        variant === "default" ? "glass-card rounded-xl p-3 md:p-2" : "",
        className,
      )}
    >
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="text-muted-foreground h-5 w-5" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, keyword, or company"
          className="bg-background text-foreground border-input focus-visible:ring-ring block w-full rounded-lg border py-2.5 pr-3 pl-10 focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <Button
        type="submit"
        className={cn(
          "bg-primary hover:bg-primary/80 font-medium text-white md:min-w-32",
          variant === "minimal" ? "px-4 py-2" : "",
        )}
      >
        Find Jobs
      </Button>
    </form>
  );
};

export default SearchBar;

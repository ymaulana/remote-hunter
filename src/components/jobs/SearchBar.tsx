"use client";

import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (search: string, location: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search, location);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-lg md:flex-row md:items-center"
      >
        <div className="bg-background flex flex-1 items-center gap-3 rounded-lg px-4 py-3">
          <Search className="text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
        </div>

        <div className="bg-background flex flex-1 items-center gap-3 rounded-lg px-4 py-3">
          <MapPin className="text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Location or timezone"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-primary hover:bg-primary/90 rounded-lg px-8 py-3 font-semibold text-white shadow-md transition-colors"
        >
          Search Jobs
        </motion.button>
      </form>
    </motion.div>
  );
}

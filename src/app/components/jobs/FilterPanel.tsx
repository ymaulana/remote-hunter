"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: { tags: string[] }) => void;
  initialFilters?: {
    tags?: string[];
  };
}

const popularTags = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Entry Level",
];

export default function FilterPanel({
  onFilterChange,
  initialFilters,
}: FilterPanelProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialFilters?.tags || [],
  );

  // Sync with initialFilters when they change (e.g. valid URL navigation)
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.tags) setSelectedTags(initialFilters.tags);
    }
  }, [initialFilters]);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilterChange({ tags: newTags });
  };

  const clearFilters = () => {
    setSelectedTags([]);
    onFilterChange({ tags: [] });
  };

  // Combine popular tags with any selected tags that aren't in the list
  const allDisplayTags = Array.from(new Set([...popularTags, ...selectedTags]));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-border/60 sticky top-24 rounded-xl border p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-bold tracking-wider uppercase">
          Filters
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-primary text-sm hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Tags Filter */}
      <div className="mb-6">
        <h4 className="text-foreground mb-3 text-sm font-medium">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {allDisplayTags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTag(tag)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <X className="ml-1.5 inline h-3 w-3" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

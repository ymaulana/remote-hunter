"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: {
    tags: string[];
    salaryMin?: number;
    salaryMax?: number;
  }) => void;
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

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState<string>("");
  const [salaryMax, setSalaryMax] = useState<string>("");

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    applyFilters(newTags, salaryMin, salaryMax);
  };

  const applyFilters = (tags: string[], min: string, max: string) => {
    onFilterChange({
      tags,
      salaryMin: min ? parseInt(min) : undefined,
      salaryMax: max ? parseInt(max) : undefined,
    });
  };

  const handleSalaryChange = () => {
    applyFilters(selectedTags, salaryMin, salaryMax);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSalaryMin("");
    setSalaryMax("");
    onFilterChange({ tags: [] });
  };

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
        {(selectedTags.length > 0 || salaryMin || salaryMax) && (
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
          {popularTags.map((tag) => (
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

      {/* Salary Range Filter */}
      <div>
        <h4 className="text-foreground mb-3 text-sm font-medium">
          Salary Range (USD)
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">
              Minimum
            </label>
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              onBlur={handleSalaryChange}
              placeholder="e.g. 50000"
              className="bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">
              Maximum
            </label>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              onBlur={handleSalaryChange}
              placeholder="e.g. 100000"
              className="bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useRef, useId, useCallback } from "react";
import { MapPin, Loader2, X, Sparkles } from "lucide-react";

export default function PlaceAutocomplete({
  value = "",
  onChange,
  onSelect,
  placeholder = "Enter place or stop name...",
  id,
  name,
  required = false,
  className = "",
  inputClassName = "",
  icon = null,
  autoFocus = false,
}) {
  const listboxId = useId();
  const [internalValue, setInternalValue] = useState("");
  const query = value !== undefined ? value : internalValue;

  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const fetchAbortRef = useRef(null);
  const isFocusedRef = useRef(false);
  const isUserTypingRef = useRef(false);
  const justSelectedRef = useRef(false);

  // Close dropdown helper and abort in-flight requests
  const closeDropdown = useCallback(() => {
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        isFocusedRef.current = false;
        isUserTypingRef.current = false;
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [closeDropdown]);

  // Debounced suggestion fetch
  useEffect(() => {
    // If this update was triggered by selecting an item from the list, skip fetching
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      closeDropdown();
      return;
    }

    const trimmed = (query || "").trim();
    if (!trimmed) {
      setSuggestions([]);
      closeDropdown();
      return;
    }

    // Only fetch if user is actively interacting/typing or focused
    if (!isUserTypingRef.current && !isFocusedRef.current) {
      return;
    }

    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }

    const abortController = new AbortController();
    fetchAbortRef.current = abortController;

    const timer = setTimeout(async () => {
      // Re-verify that user hasn't blurred/clicked outside in the meantime
      if (!isFocusedRef.current) {
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/stops/suggest?q=${encodeURIComponent(trimmed)}`,
          { signal: abortController.signal }
        );
        if (res.ok) {
          const data = await res.json();
          const items = data.suggestions || [];
          setSuggestions(items);

          // ONLY open dropdown if the user is still actively focused on this input and was typing
          if (isFocusedRef.current && isUserTypingRef.current && items.length > 0) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
          setHighlightedIndex(-1);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Suggestion fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query, closeDropdown]);

  function handleInputChange(e) {
    const val = e.target.value;
    isUserTypingRef.current = true;
    justSelectedRef.current = false;
    setInternalValue(val);

    if (!val.trim()) {
      setSuggestions([]);
      closeDropdown();
      setLoading(false);
    }

    if (onChange) {
      onChange(val);
    }
  }

  function handleFocus() {
    isFocusedRef.current = true;
    if (isUserTypingRef.current && suggestions.length > 0) {
      setIsOpen(true);
    }
  }

  function handleBlur(e) {
    // If focus moves within container (e.g., clicking clear button), ignore
    if (containerRef.current && containerRef.current.contains(e.relatedTarget)) {
      return;
    }
    isFocusedRef.current = false;
    isUserTypingRef.current = false;
    closeDropdown();
  }

  function handleSelect(item) {
    justSelectedRef.current = true;
    isUserTypingRef.current = false;
    setInternalValue(item.name);
    setSuggestions([]);
    closeDropdown();

    if (onChange) {
      onChange(item.name);
    }
    if (onSelect) {
      onSelect(item);
    }
  }

  function handleClear() {
    isUserTypingRef.current = false;
    justSelectedRef.current = false;
    setInternalValue("");
    setSuggestions([]);
    closeDropdown();
    setLoading(false);

    if (onChange) {
      onChange("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleKeyDown(e) {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative w-full">
        {/* Leading Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          {icon || <MapPin className="w-4 h-4 text-gray-500" />}
        </div>

        {/* Input Field with Combobox role */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          id={id}
          name={name}
          required={required}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          className={
            inputClassName ||
            "w-full pl-10 pr-9 py-3 bg-white text-gray-900 font-semibold placeholder:text-gray-500 border border-gray-300 focus:border-red-500 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:outline-hidden transition"
          }
        />

        {/* Trailing Controls: Loading spinner / Clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
          {query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear text"
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <span>Matching Bus Stops</span>
            <span className="text-gray-400 font-normal">Use ↑↓ keys</span>
          </div>

          <ul
            id={listboxId}
            role="listbox"
            className="max-h-60 overflow-y-auto divide-y divide-gray-100 py-1"
          >
            {suggestions.map((item, index) => {
              const isHighlighted = highlightedIndex === index;
              return (
                <li
                  key={item.id}
                  onMouseDown={(e) => {
                    // Prevent blur before selection
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                    isHighlighted
                      ? "bg-red-50 text-red-900"
                      : "hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isHighlighted
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-gray-900 truncate">
                        {item.name}
                      </div>
                      {item.matchedAlias && (
                        <div className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                          <span className="text-red-600 font-medium">Alias:</span>
                          <span>{item.matchedAlias}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.isFuzzy && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Did you mean?
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

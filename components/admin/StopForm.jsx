"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, X, MapPin } from "lucide-react";
import { createStopAction } from "@/app/actions/stopActions";

export default function StopForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Aliases tags
  const [aliasInput, setAliasInput] = useState("");
  const [aliases, setAliases] = useState([]);

  function addAlias() {
    const clean = aliasInput.trim();
    if (!clean) return;
    if (aliases.includes(clean)) {
      toast.error("This alias is already added.");
      return;
    }
    setAliases([...aliases, clean]);
    setAliasInput("");
  }

  function removeAlias(index) {
    setAliases(aliases.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Official stop name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await createStopAction({
        name: name.trim(),
        description: description.trim() || null,
        aliases,
        isActive,
      });

      if (res.success) {
        toast.success(`Stop "${name}" created successfully!`);
        router.push("/admin/stops");
      } else {
        toast.error(res.error || "Failed to create stop.");
      }
    } catch {
      toast.error("Error creating stop.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/stops"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Stops
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Create New Bus Stop
            </h2>
            <p className="text-xs text-gray-500">
              Add a new official transit stop and its local aliases or
              abbreviations.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Official Stop Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. South Pier Gate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description / Landmark (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Near Harbor gate 3, connecting to southern coastal ferry..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Alternative Names &amp; Aliases
            </label>
            <p className="text-[11px] text-gray-400 mb-2">
              Add common abbreviations or local spellings to improve searchability
              (e.g. &quot;Pier Gate&quot;, &quot;SP Gate&quot;).
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Type an alias and click Add..."
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAlias();
                  }
                }}
                className="flex-1 px-3 py-2 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addAlias}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"
              >
                Add Alias
              </button>
            </div>

            {aliases.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {aliases.map((alias, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-gray-800 border border-gray-200 shadow-2xs"
                  >
                    {alias}
                    <button
                      type="button"
                      onClick={() => removeAlias(index)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="isActiveStop"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label
              htmlFor="isActiveStop"
              className="text-xs font-semibold text-gray-800 cursor-pointer"
            >
              Stop is active and available for route sequences
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/stops"
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving Stop..." : "Save Bus Stop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

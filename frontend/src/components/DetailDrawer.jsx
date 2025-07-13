// src/components/DetailDrawer.jsx
import { useEffect, useRef } from "react";
import { useSelectedItem } from "../SelectedItemContext";

export default function DetailDrawer() {
  const { item, setItem } = useSelectedItem();
  const ref = useRef();

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setItem(null);
    }
    if (item) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, setItem]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      aria-labelledby="drawer-title"
      role="dialog"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setItem(null)}
      />

      {/* panel */}
      <div
        ref={ref}
        className="relative ml-auto h-full w-full max-w-3xl
                   bg-white shadow-xl flex flex-col"
      >
        {/* header */}
        <header className="flex items-start justify-between p-6 border-b">
          <h2 id="drawer-title" className="text-2xl font-bold pr-4">
            {item.title}
          </h2>
          <button
            onClick={() => setItem(null)}
            className="rounded-md p-2 hover:bg-gray-100"
            aria-label="Close panel"
          >
            ✕
          </button>
        </header>

        {/* body – scrolls if long */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <p className="text-gray-700 whitespace-pre-line">
            {item.description}
          </p>

          <section>
            <h3 className="font-semibold mb-2">Resources</h3>
            <ul className="space-y-2 list-disc list-inside">
              {item.resources.map((r, i) => (
                <li key={i} className="text-sm text-gray-600">
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-brand hover:underline"
          >
            Open original →
          </a>
        </div>
      </div>
    </div>
  );
}

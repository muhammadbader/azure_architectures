// // frontend/src/App.jsx
// import { useEffect, useState } from "react";
// import { apiGet, apiPost } from "./lib/api";   // we’ll add these helpers next
// import ArchitectureCard from "./components/ArchitectureCard";
// import "./index.css";                          // Tailwind directives

// export default function App() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [scraping, setScraping] = useState(false);

//   // Fetch on first paint
//   useEffect(() => {
//     handleReload();
//   }, []);

//   async function handleReload() {
//     setLoading(true);
//     try {
//       const data = await apiGet("/architectures");
//       setItems(data);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleScrape() {
//     setScraping(true);
//     try {
//       await apiPost("/scrape");     // fire-and-forget endpoint
//       await handleReload();         // refresh list when done
//     } finally {
//       setScraping(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       {/* header */}
//       <header className="flex items-center justify-between gap-4 p-6 shadow-sm bg-white">
//         <h1 className="text-3xl font-bold">Azure Architectures</h1>
//         <div className="flex gap-2">
//           <Button onClick={handleReload} disabled={loading || scraping}>
//             {loading ? "Loading…" : "Reload"}
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleScrape}
//             disabled={scraping}
//           >
//             {scraping ? "Scraping…" : "Scrape"}
//           </Button>
//         </div>
//       </header>

//       {/* content */}
//       <main className="p-6">
//         {items.length === 0 && !loading ? (
//           <p className="text-gray-500">No architectures yet.</p>
//         ) : (
//           <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {items.map((a) => (
//               <ArchitectureCard key={a.id} data={a} />
//             ))}
//           </ul>
//         )}
//       </main>
//       {/* <DetailDrawer /> */}
//     </div>
//   );
// }

// /* ───────────────────────────────────────── Button component ── */
// function Button({ children, onClick, disabled, variant = "secondary" }) {
//   const base =
//     "rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50";
//   const variants = {
//     primary:
//       "bg-brand text-white hover:bg-brand/90 focus:ring-2 focus:ring-brand/50",
//     secondary:
//       "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400/50",
//   };
//   return (
//     <button
//       className={`${base} ${variants[variant]}`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {children}
//     </button>
//   );
// }

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "./lib/api";
import ArchitectureCard from "./components/ArchitectureCard";
import { Dialog } from "@headlessui/react";
import "./index.css";

function DetailDialog({ item, open, setOpen }) {
  if (!item) return null;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-2xl w-full rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-bold text-blue-900">
            {item.title}
          </Dialog.Title>
          <p className="text-gray-700 mt-2">{item.description}</p>
          <ul className="mt-4 space-y-2 text-sm list-disc pl-5 text-gray-700 max-h-60 overflow-auto">
            {item.resources?.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3 items-center">
              <a
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Source
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(item.source_url);
                }}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Copy Link
              </button>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleReload();
  }, []);

  async function handleReload() {
    setLoading(true);
    try {
      const data = await apiGet("/architectures");
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleScrape() {
    setScraping(true);
    try {
      await apiPost("/scrape");
      await handleReload();
    } finally {
      setScraping(false);
    }
  }

  function handleCardClick(item) {
    setSelected(item);
    setOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">
        Azure Architectures
      </h1>

      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {scraping ? "Scraping..." : "Scrape Architectures"}
          </button>
          <button
            onClick={handleReload}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            {loading ? "Reloading..." : "Reload"}
          </button>
        </div>
        <span className="text-sm text-gray-600">
          Showing <strong>{items.length}</strong> results
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ArchitectureCard
            key={item._id}
            item={item}
            onClick={handleCardClick}
          />
        ))}
      </div>
      <DetailDialog item={selected} open={open} setOpen={setOpen} />
    </div>
  );
}

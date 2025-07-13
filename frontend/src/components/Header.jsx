import React from "react";

const Header = ({ onScrape, loading }) => (
  <header className="bg-white shadow p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-blue-600">Azure Architectures</h1>
    <button
      onClick={onScrape}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
    >
      {loading ? "Scraping..." : "Trigger Scrape"}
    </button>
  </header>
);

export default Header;

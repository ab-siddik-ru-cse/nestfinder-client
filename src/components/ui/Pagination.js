import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
            ${p === page ? 'bg-brand-600 text-white' : 'border border-gray-200 hover:border-brand-400 text-gray-700'}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

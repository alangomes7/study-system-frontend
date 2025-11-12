'use client';

type Props = {
  currentPage: number;
  totalPages: number;
  onPaginate: (page: number) => void;
};

export default function StudentsPagination({
  currentPage,
  totalPages,
  onPaginate,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className='flex justify-center mt-6'>
      <button
        onClick={() => onPaginate(currentPage - 1)}
        disabled={currentPage === 1}
        className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPaginate(i + 1)}
          className={`btn mx-1 ${
            currentPage === i + 1
              ? 'btn-primary'
              : 'border border-border bg-card-background hover:bg-foreground/5'
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPaginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
      >
        &gt;
      </button>
    </div>
  );
}

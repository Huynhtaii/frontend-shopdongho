const Pagination = ({ page, totalPages, setPage }) => {
    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <button
                onClick={() => setPage(page > 1 ? page - 1 : page)}
                className="w-10 h-8 text-sm border rounded hover:bg-gray-100"
                disabled={page === 1}
            >
                Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => setPage(index + 1)}
                    className={`w-8 h-8 text-sm border rounded hover:bg-gray-100 
                        ${index + 1 === page ? 'bg-primary text-white' : ''}`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                onClick={() => setPage(page < totalPages ? page + 1 : page)}
                className="w-10 h-8 text-sm border rounded hover:bg-gray-100"
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
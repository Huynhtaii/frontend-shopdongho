import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const Pagination = ({ page, totalPages, setPage }) => {
   if (totalPages <= 1) return null;

   return (
      <div className="flex items-center justify-center gap-3 py-10">
         <button
            onClick={() => setPage(page > 1 ? page - 1 : page)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 
                    ${
                       page === 1
                          ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-md'
                    }`}
            disabled={page === 1}
         >
            <IoChevronBack size={18} />
         </button>

         <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => {
               const pageNum = index + 1;
               const isActive = pageNum === page;

               return (
                  <button
                     key={pageNum}
                     onClick={() => setPage(pageNum)}
                     className={`w-10 h-10 text-sm font-medium rounded-full transition-all duration-200 
                                ${
                                   isActive
                                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50'
                                      : 'text-gray-600 hover:bg-gray-100'
                                }`}
                  >
                     {pageNum}
                  </button>
               );
            })}
         </div>

         <button
            onClick={() => setPage(page < totalPages ? page + 1 : page)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 
                    ${
                       page === totalPages
                          ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-md'
                    }`}
            disabled={page === totalPages}
         >
            <IoChevronForward size={18} />
         </button>
      </div>
   );
};

export default Pagination;

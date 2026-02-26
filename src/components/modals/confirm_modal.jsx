const ConfirmModal = ({
   isOpen,
   title,
   message,
   onConfirm,
   onCancel,
   confirmLabel = 'Xác nhận',
   cancelLabel = 'Hủy bỏ',
   confirmDanger = true,
}) => {
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
         {/* Overlay */}
         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

         {/* Modal */}
         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
            {/* Icon */}
            <div
               className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmDanger ? 'bg-red-100' : 'bg-amber-100'}`}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-6 h-6 ${confirmDanger ? 'text-red-600' : 'text-amber-600'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
               </svg>
            </div>

            <h3 className="text-center font-bold text-slate-800 text-lg mb-1">{title}</h3>
            <p className="text-center text-slate-500 text-sm mb-6">{message}</p>

            <div className="flex gap-3">
               <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
               >
                  {cancelLabel}
               </button>
               <button
                  onClick={onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md ${
                     confirmDanger
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                        : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                  }`}
               >
                  {confirmLabel}
               </button>
            </div>
         </div>
      </div>
   );
};

export default ConfirmModal;

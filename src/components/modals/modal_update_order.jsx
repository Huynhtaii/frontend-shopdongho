import { useState } from 'react';

const ModalUpdateOrder = ({ show, handleClose, orderId, currentStatus, onUpdateStatus }) => {
    const [status, setStatus] = useState(currentStatus);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateStatus(orderId, status);
        handleClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Cập nhật trạng thái đơn hàng
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalUpdateOrder;

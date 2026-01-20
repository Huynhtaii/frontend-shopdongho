import axios from "../utils/axios_config";
const OrderService = {
    getAllOrders: () => {
        const url = '/v1/read-all/orders'
        const response = axios.get(url)
        return response
    },
    addOrder: (data) => {
        const url = `/v1/create/order`
        const response = axios.post(url, data)
        return response
    },
    updateOrderStatus: (id, status) => {
        const url = `/v1/update/order-status/${id}`
        const response = axios.put(url, { status })
        return response
    },
    deleteOrder: (id) => {
        const url = `/v1/delete/order/${id}`
        const response = axios.delete(url)
        return response
    }
}

export default OrderService
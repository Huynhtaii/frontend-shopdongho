import axios from "../utils/axios_config";
const UserService = {
    getAllUsers: () => {
        const url = '/v1/read-all/users'
        const response = axios.get(url)
        return response
    },
    addUser: (data) => {
        const url = `/v1/create/user`
        const response = axios.post(url, data)
        return response
    },
    updateUser: (id, data) => {
        const url = `/v1/update/user/${id}`
        const response = axios.put(url, data)
        return response
    },
    deleteUser: (id) => {
        const url = `/v1/delete/user/${id}`
        const response = axios.delete(url)
        return response
    },
    loginUser: (data) => {
        const url = `/v1/login/user`
        const response = axios.post(url, data)
        return response
    },
    logOutUser: () => {
        const url = `/v1/logout/user`
        const response = axios.post(url)
        return response
    },
    registerUser: (data) => {
        const url = `/v1/register/user`
        const response = axios.post(url, data)
        return response
    }
}

export default UserService
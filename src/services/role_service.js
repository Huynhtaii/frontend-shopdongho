import axios from "../utils/axios_config";

const RoleService = {
    getAllRoles: async () => {
        const url = '/v1/read-all/roles';
        return await axios.get(url);
    }
}

export default RoleService;

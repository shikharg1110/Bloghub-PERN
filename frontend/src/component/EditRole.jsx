import axios from "axios";
import { useEffect, useState } from "react";
import toast, {Toaster} from 'react-hot-toast';

const EditRole = () => {
    
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [checkedPermissions, setCheckedPermissions] = useState([]);

    const handleRoleOption = async() => {
        try {
            const getroleData = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getRole`);
            console.log("role: ", getroleData.data);
            setRoles(getroleData.data);
        }
        catch(err) {
            console.error("Error while fetching role: ", err);
        }
    }


    const handlePermission = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getPermissions`);
            console.log(response.data.rows);
            setPermissions(response.data.rows);
        }
        catch(err) {
            console.error("Error fetching permission: ", err);
        }
    }

    // handle permission checkbox change
    const handlePermissionChange = (e) => {
        const permissionId = parseInt(e.target.value);
        if(e.target.checked) {
            // add permissionid to array if checked
            setCheckedPermissions([...checkedPermissions, permissionId]);
        }
        else {
            // remove permissionid to array if not checked
            setCheckedPermissions(checkedPermissions.filter(id => id !== permissionId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selectedRole);
        const payload = {
            selectedRole,
            permissions: checkedPermissions
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/editRole`, payload);
            if(response.status === 200) {
                toast.success("Role edited successfully");
                console.log("role edited: ", response.data);
            }
            else {
                toast.error("Error while editing role");
            }
        }
        catch(err) {
            toast.error("Failed to edit role");
            console.error("Error while editing role: ", err);
        }
    }

    useEffect(() => {
        handlePermission();
        handleRoleOption();
    }, []);


    return (
        <div className="container">
            <h1>Edit Role</h1>
            <form id="editRoleForm" onSubmit={handleSubmit}>

            <div className="mb-3">
                    <label htmlFor="roleAssign" className="form-label">Role</label>
                    <select 
                        name="roleAssign" 
                        id="roleAssign" 
                        className="form-control" 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        {
                            roles.map(role => (
                                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                            ))
                        }
                    </select>
                </div>

                <h2>Permissions: </h2>
                <div className="mb-3">
                    {
                        permissions.map((permission) => (
                            <div key={permission.permission_id} className="row mb-2">
                                <div className="col-3">
                                    <label htmlFor={`permission-${permission.permission_id}`} className="form-label">
                                        {permission.permission_name}
                                    </label>
                                </div>
                                <div className="col-auto">
                                    <input type="checkbox"
                                        value={permission.permission_id}
                                        id={`permission-${permission.permission_id}`} 
                                        className="form-check-input"
                                        style={{border: "2px solid #343a40"}}
                                        onChange={handlePermissionChange}
                                    />
                                </div>
                                <br />
                            </div>
                        ))
                    }
                </div>

                <button className="btn btn-dark" type="submit">Edit Role</button>
            </form>

        </div>
    );
}

export default EditRole;
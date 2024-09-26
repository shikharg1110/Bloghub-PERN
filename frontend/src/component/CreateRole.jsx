import axios from "axios";
import { useEffect, useState } from "react";
import toast, {Toaster} from 'react-hot-toast';

const CreateRole = () => {

    const [permissions, setPermissions] = useState([]);
    const [checkedPermissions, setCheckedPermissions] = useState([]);
    const [roleName, setRoleName] = useState("");

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
        const payload = {
            roleName,
            permissions: checkedPermissions
        };

        try {
            const findRole = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getRole/${roleName}`);
            if(findRole.data.rows.length > 0) {
                toast.error("Role already exit")
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/createRole`, payload);
            if(response.status === 200) {
                toast.success("Role created successfully");
                console.log("role created: ", response.data);
            }
            else {
                toast.error("Error creating role");
            }
        }
        catch(err) {
            toast.error("Failed to create role");
            console.error("Error creating role: ", err);
        }
    }

    useEffect(() => {
        handlePermission();
    }, []);


    return (
        <div className="container">
            <h1>Create Role</h1>
            <form id="createRoleForm" onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="roleNameInput" className="form-label">Role Name</label>
                    <input type="text" className="form-control" id="roleNameInput" value={roleName} onChange={(e)=> setRoleName(e.target.value)}/>
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

                <button className="btn btn-dark" type="submit">Create Role</button>
            </form>
            <Toaster />
        </div>
    );
}

export default CreateRole;
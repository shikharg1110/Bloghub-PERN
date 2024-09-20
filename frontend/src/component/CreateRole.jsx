import axios from "axios";
import { useEffect, useState } from "react";

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
            const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/createRole`, payload);
            console.log("role created: ", response.data);
        }
        catch(err) {
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
                            <div key={permission.permission_id}>
                                <label htmlFor={`permission-${permission.permission_id}`} className="form-label mx-3">
                                    {permission.permission_name}
                                </label>
                                <input type="checkbox"
                                    value={permission.permission_id}
                                    id={`permission-${permission.permission_id}`} 
                                    className="form-check-input"
                                    onChange={handlePermissionChange}
                                />
                                <br />
                            </div>
                        ))
                    }
                </div>

                <button className="btn btn-dark" type="submit">Create Role</button>
            </form>

        </div>
    );
}

export default CreateRole;
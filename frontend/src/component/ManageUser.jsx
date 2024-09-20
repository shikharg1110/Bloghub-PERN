import { useEffect, useState } from "react";
import axios from 'axios';

const ManageUser = () => {

    const [ email, setEmail ] = useState("");
    const [ roles, setRoles ] = useState([]);
    const [ selectedRole, setSelectedRole ] = useState("");

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

    const handleRoleAssign = async(e) => {
        e.preventDefault();
        console.log('selected role: ', selectedRole);
        if(email !== '' && roles !== '') {
            try {
                const user = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/roleAssignment`, {
                    email_id: email,
                    role_id: selectedRole
                }, {
                    withCredentials: true
                })

                if(user.status === 200) {
                    alert("Role changed successfully");
                }
            }
            catch(err) {
                console.log(err);
            }
        }
        else if(email === "") {
            alert("Email should not be empty")
        }
        else if(roles === "") {
            alert("Role should not empty")
        }
    }
    useEffect(() => {
        handleRoleOption();
    }, [])

    return (
        <>
        <div className="container mb-3">
            <h1 className="text-center">Manage User</h1>
            <form id="authorCreation">
                <div className="mb-3">
                    <label htmlFor="searchEmail" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="searchEmail" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)}/>
                </div>
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
                <button onClick={handleRoleAssign} className="btn btn-dark mb-3">Assign Role</button>
            </form>

        </div>
        </>
    )
}

export default ManageUser;
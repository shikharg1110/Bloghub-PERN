import { useEffect, useState } from "react";
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';

const ManageUser = () => {

    const [ email, setEmail ] = useState("");
    const [ roles, setRoles ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ selectedUser, setSelectedUser ] = useState("");
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

    const handleUser = async() => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getUser`);
            console.log("users: ",res.data);
            setUsers(res.data);
            // setEmail(res.data.email_id)
        }
        catch(err) {
            console.log("Error while fetching user: ",err);
        }
    }

    const handleRoleAssign = async(e) => {
        e.preventDefault();
        console.log('selected role: ', selectedRole);
        console.log("email: ", email);
        if(email === "") {
            toast.error("Please select a user")
        }
        else if(selectedRole === "") {
            toast.error("Please select a role")
        }
        else {
            try {
                const res = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/roleAssignment`, {
                    email_id: email,
                    role_id: selectedRole
                }, {
                    withCredentials: true
                })

                if(res.status === 200) {
                    toast.success("Role changed successfully");
                }
            }
            catch(err) {
                console.log(err);
                toast.error("Failed to assign role");
            }
        }
    }

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);

        const selectedUserObj = users.find(user => user.user_id === parseInt(userId));
        if(selectedUserObj)
            setEmail(selectedUserObj.email_id);
    }

    useEffect(() => {
        handleRoleOption();
        handleUser();
    }, [])

    return (
        <>
        <div className="container mb-3">
            <h1 className="text-center">Manage User</h1>
            <form id="authorCreation">
                {/* <div className="mb-3">
                    <label htmlFor="searchEmail" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="searchEmail" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)}/>
                </div> */}
                <div className="mb-3">
                    <label htmlFor="userList" className="form-label">User List</label>
                    <select 
                        name="userList" 
                        id="userList" 
                        className="form-control" 
                        value={selectedUser}
                        onChange={handleUserChange}
                    >
                        <option value="">Select User</option>
                        {
                            users.map(user => (
                                <option key={user.user_id} value={user.user_id}>{user.user_name} ({user.email_id})</option>
                            ))
                        }
                    </select>
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
            <Toaster />
        </div>
        </>
    )
}

export default ManageUser;
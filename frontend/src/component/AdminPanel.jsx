import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {

    const [ roles, setRoles ] = useState([]);
    const [ getUser, setGetUser] = useState([]);
    const [roleMap, setRoleMap] = useState({});

    const handleGetUser = async() => {
        try {
            const getuserData = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getUser`);
            console.log("all user: ", getuserData.data);
            setGetUser(getuserData.data);
        }
        catch(err) {
            console.error("Error while fetching role: ", err);
        }
    }

    const handleRoleOption = async() => {
        try {
            const getroleData = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getRole`);
            console.log("role: ", getroleData.data);
            setRoles(getroleData.data);

            // Create roleMap for quick lookup
            const newRoleMap = getroleData.data.reduce((map, role) => {
                map[role.role_id] = role.role_name;
                return map;
            }, {});
            setRoleMap(newRoleMap);
        }
        catch(err) {
            console.error("Error while fetching role: ", err);
        }
    }

    const handleUserProfile = (e) => {
        console.log(e);
        const id = e.user_id;
        navigate(`/user/${id}`);
    }

    useEffect(() => {
        handleRoleOption();
        handleGetUser();
    }, [])

    const navigate = useNavigate();
    return (
        <>
        <div className="container mb-3">
            <label htmlFor="create role" className="m-2 ms-4">Create Role</label>            
            <button className="btn btn-dark" onClick={() => navigate('/createRole')}>Create Role</button>
            <br />
            <label htmlFor="Assign Role" className="m-2">Manage User</label>            
            <button className="btn btn-dark mb-3" onClick={() => navigate('/manageUser')}>Manage User</button>
            <h3>Account Information: {getUser.length}</h3>
            {
                getUser.map((user) => (
                    <div className="card mb-3" key={user.user_id} onClick={()=>handleUserProfile(user)} style={{cursor:'pointer'}}>
                        <div className="card-body">
                            <h5 className="card-title">{user.user_name}</h5>
                            <h6 className="card-subtitle mb-2 text-body-secondary">{user.email_id}</h6>
                            <p className="card-text">Role: {roleMap[user.role_id]}</p>
                            <p className="card-text">User Id: {user.user_id}</p>
                        </div>
                    </div>
                ))
            }
        </div>
        </>
    )
}

export default AdminPanel;
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
            <div className="row">
                <label htmlFor="createRole" className="col-2 m-2 ms-4">Create Role</label>            
                <button className="col-2 btn btn-dark mb-3" onClick={() => navigate('/createRole')}>Create Role</button>
                <br />
            </div>
            <div className="row">
                <label htmlFor="editRole" className="col-2 m-2 ms-4">Edit Role</label>            
                <button className="col-2 btn btn-dark mb-3" onClick={() => navigate('/editRole')}>Edit Role</button>
                <br />
            </div>
            <div className="row">
                <label htmlFor="Assign Role" className="col-2 m-2 ms-4">Manage User</label>            
                <button className="col-2 btn btn-dark mb-3" onClick={() => navigate('/manageUser')}>Manage User</button>
            </div>

            <h3>Account Information: {getUser.length}</h3>
            
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">S.No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email Id</th>
                        <th scope="col">Role</th>
                    </tr>
                </thead>
                <tbody>
                {
                    getUser.map((user) => (
                        <tr key={user.user_id} onClick={()=> handleUserProfile(user)} style={{cursor: "pointer"}} >
                            <th scope="row">{user.user_id}</th>
                            <td>{user.user_name}</td>
                            <td>{user.email_id}</td>
                            <td>{roleMap[user.role_id]}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
        </>
    )
}

export default AdminPanel;
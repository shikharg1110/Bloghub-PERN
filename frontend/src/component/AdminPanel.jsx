import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import NotAuthorised from "./NotAuthorised";

const AdminPanel = () => {

    const [ roles, setRoles ] = useState([]);
    const [ getUser, setGetUser] = useState([]);
    const [userRole, setUserRole] = useState({});
    const [roleMap, setRoleMap] = useState({});

    const {user} = useContext(UserContext);

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
    
    const handleGetRoleByUserId = async(userId) => {
        try {
            const getRoles = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getRoleByUserId/${userId}`);
            console.log(getRoles);
        }
        catch(err) {
            console.log("Error while getting roles by userId: ", err);
        }
    }

    const handleFetchRolesForUsers = async() => {
        const rolesMap = {};
        const promises = getUser.map(async(user) => {
            const roleData = await handleGetRoleByUserId(user.user_id);
            rolesMap[user.user_id] = roleData?.role_id ? roleMap[roleData.role_id] : 'No Role';
        });

        await Promise.all(promises);
        setUserRole(roleMap);
    }

    const handleRoleOption = async() => {
        try {
            const getroleData = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getRole`);
            console.log("role: ", getroleData.data);

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
        const fetchData = async () => {
            await handleRoleOption();
            await handleGetUser();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if(getUser.length > 0) 
            handleFetchRolesForUsers();
    }, [getUser, roleMap]);

    const navigate = useNavigate();
    return (
        user === 1 ?
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
                    getUser.map((user, index) => (
                        <tr 
                            key={user.user_id} 
                            // onClick={()=> handleUserProfile(user)} 
                            // style={{cursor: "pointer"}} 
                        >
                            <th scope="row">{user.user_id}</th>
                            <td>{user.user_name}</td>
                            <td>{user.email_id}</td>
                            <td>{userRole[user.user_id] || "Loading..."}</td>


                            {/* <td>{roleMap[user.role_id]}</td> */}
                            {/* <td>{() =>handleGetRoleByUserId(user.user_id)}</td> */}
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
        </>:
        <NotAuthorised />
    )
}

export default AdminPanel;
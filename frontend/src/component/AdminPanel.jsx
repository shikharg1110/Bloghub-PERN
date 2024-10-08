import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import NotAuthorised from "./NotAuthorised";
import { MdDelete } from "react-icons/md";
import toast, {Toaster} from 'react-hot-toast';

const AdminPanel = () => {

    const [ roles, setRoles ] = useState([]);
    const [ getUser, setGetUser] = useState([]);
    const [userRole, setUserRole] = useState({});
    const [roleMap, setRoleMap] = useState({});
    const [isHover, setIsHover] = useState(null);

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

    const confirmDelete = (e) => {
        toast((t) => (
            <span>
                Are you sure you want to delete <b>{user.user_name}</b> ?
                <div style={{marginTop: "10px"}}>
                    <button 
                        style={{marginRight: "10px"}}
                        onClick={async() => {
                            await handleUserDelete(e);
                            toast.dismiss(t.id);
                        }}
                        className="btn btn-light"
                    > Yes </button>
                    <button onClick={() => toast.dismiss(t.id)} className="btn btn-light">Cancel</button>
                </div>
            </span>
        ))
    }

    const handleUserDelete = async(user) => {
        console.log(user);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/deleteUser`, {
                userId: user.user_id
            });

            if(response.status === 200) {
                console.log(response);
                const updatedUserOptions = getUser.filter(userOption => userOption.user_id !== user.user_id);
                setGetUser(updatedUserOptions);
                toast.success("User deleted Successfully");
            }
        }
        catch(err) {
            toast.error("An error occured while deleting the user");
            console.log("An error occured while deleting the user", err);
        }
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
                <label htmlFor="manageUser" className="col-2 m-2 ms-4">Manage User</label>            
                <button className="col-2 btn btn-dark mb-3" onClick={() => navigate('/manageUser')}>Manage User</button>
            </div>
            <div className="row">
                <label htmlFor="manageTag" className="col-2 m-2 ms-4">Manage Tag</label>            
                <button className="col-2 btn btn-dark mb-3" onClick={() => navigate('/manageTag')}>Manage Tag</button>
            </div>

            <h3>Account Information: {getUser.length}</h3>
            
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">S.No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email Id</th>
                        <th scope="col">Role</th>
                        <th scope="col">Delete</th>
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
                            <td
                                style={{cursor: "pointer"}}
                                onClick={() =>confirmDelete(user)}
                                onMouseEnter={() => setIsHover(user.user_id)}
                                onMouseLeave={() => setIsHover(null)}
                            >
                                <MdDelete size={25} color={isHover === user.user_id ? 'red': 'black'} />
                            </td>


                            {/* <td>{roleMap[user.role_id]}</td> */}
                            {/* <td>{() =>handleGetRoleByUserId(user.user_id)}</td> */}
                        </tr>
                    ))
                }
                </tbody>
            </table>
            <Toaster />
        </div>
        </>:
        <NotAuthorised />
    )
}

export default AdminPanel;
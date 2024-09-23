import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dateToShow } from "../utility/formatDate";
import UserContext from "../context/UserContext";



const UserProfile = () => {

    const {user, setUser, userRole, setUserRole} = useContext(UserContext);

    const {id} = useParams();

    const [ getUser, setGetUser] = useState([]);
    const [ userProfile, setUserProfile] = useState(null);
    const [roleMap, setRoleMap] = useState({});
    const [roles, setRoles] = useState([]);
    const [ havePermissions, setHavePermissions] = useState([]);
    // const [date, setDate] =useState(null);
    
    const handleGetUser = async() => {
        try {
            const getuserData = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getUser`);
            console.log("all user: ", getuserData.data);
            setGetUser(getuserData.data);
            setUserProfile(getuserData.data[id-1]);
            // setDate(dateToShow(userProfile.created_at));
            // console.log(date);
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

    const handleRolePermission = async()=>{
        try {
            console.log("userRole: ",userRole);
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getPermissionsByRoleId/${userRole}`);
            console.log(response.data.permissions);
            setHavePermissions(response.data.permissions);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetUser();
        handleRoleOption();
        handleRolePermission();
    }, [])

    return (
        <>
        <div className="container">

        <h1>User Profile</h1>
        {
            userProfile ?
            (
                <>
                
                <div className="container border border-2">
                    <h3>{userProfile.user_name}</h3>
                    <p>Email: {userProfile.email_id}</p>
                    <p>Role: {roleMap[userProfile.role_id]}</p>
                    <p>Created At: {dateToShow(userProfile.created_at)}</p>
                </div>
                
                {
                havePermissions.includes(8) === true? 
                <button className="btn btn-dark">Edit role</button>
                :
                ""
                }
                {
                havePermissions.includes(6) === true? 
                <button className="btn btn-dark">Delete role</button>
                :
                ""
                }
                </>
            ) 
            :
            (
                <h2>user not found</h2>
            )
        }

        {/* Create change password */}
        </div>
        </>
    );
}

export default UserProfile;
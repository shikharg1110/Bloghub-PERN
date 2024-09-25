import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dateToShow } from "../utility/formatDate";

const UserProfile = () => {

    const {id} = useParams(); //userId
    console.log("id: ",id);

    const [ userProfile, setUserProfile ] = useState(null);
    const [ userRole, setUserRole ] = useState({});
    const [ roleMap, setRoleMap ] = useState({});
    
    const handleGetUser = async() => {
        try {
            const getUserData = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getUserById/${id}`);

            console.log("user data: ", getUserData.data.rows[0]);
            setUserProfile(getUserData.data.rows);
            handleGetRoleByUserId(id);
        }
        catch(err) {
            console.error("Error while fetching user by id: ", err);
        }
    }

    const handleGetRoleByUserId = async (userId) => {
        try {
            const getRoles = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getRoleByUserId/${userId}`);
            const roleId = getRoles.data.role_id;
            setUserRole(roleMap[roleId]);
            console.log("user role: ", roleMap[roleId]);
        }
        catch(err) {
            console.log("Error while getting roles by userId: ", err);
        }
    };

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


    useEffect(() => {
        handleGetUser();
        handleRoleOption();
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
                    <p>Role: {userRole ? userRole: "Loading..."}</p>
                    <p>Created At: {dateToShow(userProfile.created_at)}</p>
                </div>
                <button className="btn btn-dark me-3 mt-3">Edit account</button>
                <button className="btn btn-dark mt-3">Delete account</button>
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
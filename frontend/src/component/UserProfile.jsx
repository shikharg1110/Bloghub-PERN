import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
    const {id} = useParams();

    const [ getUser, setGetUser] = useState([]);
    const [ userProfile, setUserProfile] = useState(null);

    const handleGetUser = async() => {
        try {
            const getuserData = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getUser`);
            console.log("all user: ", getuserData.data);
            setGetUser(getuserData.data);
            setUserProfile(getuserData.data[id-1]);
        }
        catch(err) {
            console.error("Error while fetching role: ", err);
        }
    }

    useEffect(() => {
        handleGetUser();
    }, [])

    return (
        <>
        <div className="container">

        <h1>User Profile</h1>
        {
            userProfile ?
            (
                <div className="container border border-2">
                <h3>{userProfile.user_name}</h3>
                <p>Email: {userProfile.email_id}</p>
                <p>Role: {userProfile.role_id}</p>
                <p>Created At: {userProfile.created_at}</p>
                </div>
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
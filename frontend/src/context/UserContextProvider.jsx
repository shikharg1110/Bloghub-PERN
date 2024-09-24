import { useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [hasPermission, setHasPermission] = useState([]);

    return (
        <UserContext.Provider value={{user, setUser, userRole, setUserRole, hasPermission, setHasPermission}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;
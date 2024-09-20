import { useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser, userRole, setUserRole}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;
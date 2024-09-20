import { useContext } from 'react';
import blogHubLogo from '../img/blogHubLogo.png';
import { IoMdSearch } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Outlet, Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();

    const deleteCookie = (cookieName) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }

    const {user, setUser, userRole, setUserRole} = useContext(UserContext);
    const handleSignOut = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/logout`, {
                withCredentials: true
            });
            if(response.status === 200) {
                setUser(null);
                setUserRole(null);
                deleteCookie('connect.sid');
                navigate('/');
                alert("Successfully logged out");
            }
        }
        catch(err) {
            if(err.response && err.response.status === 401) {
                console.log("User is not logged in");
                alert("User is not logged in");
            }
            else {
                console.error("Error logging out:", err);
                alert("Failed to log out");
            }
        }
    }

    return (
        <>
            <header className='container d-flex justify-content-between mt-2 mb-2 gap-2'>
                <Link to="/">
                    <div className="logo">
                        <img src={blogHubLogo} alt="BlogHub Logo"/> 
                    </div>
                </Link>
                <div className='d-flex align-items-center gap-2'>
                    <IoMdSearch size={30}/>
                    <input type="text" className='form-control' />
                </div>
                <div>
                    {
                        userRole === 1 ? 
                        <>

                        <Link to='/adminPanel'>
                            <button className='btn btn-dark me-2' >Admin Panel</button>
                        </Link>
                        <Link to='/createBlog'>
                            <button className='btn btn-dark me-2' >Create Blog</button>
                        </Link>
                        <button className='btn btn-dark me-2' onClick={handleSignOut}>Sign Out</button>
                        </>
                        :
                        userRole === 2 ? 
                        <>
                        <Link to='/createBlog'>
                            <button className='btn btn-dark me-2' >Create Blog</button>
                        </Link>
                        <button className='btn btn-dark me-2' onClick={handleSignOut}>Sign Out</button>
                        </>
                        :
                        userRole === 5 ?
                        <button className='btn btn-dark me-2' onClick={handleSignOut}>Sign Out</button>
                        :
                        <>
                        <Link to="/login">
                            <button className='btn btn-dark me-2'>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className='btn btn-dark'>Sign Up</button>
                        </Link>
                        </>
                    }
                </div>
                <Outlet />
            </header>
            <div className="categories bg-dark text-light">
                <ul className='list-unstyled d-flex justify-content-between mx-4'>
                    <li><IoMenu size={30}/></li>
                    <li>Technology</li>
                    <li>Sports</li>
                    <li>Entertainment</li>
                    <li>World</li>
                    <li>Space</li>
                    <li>Business</li>
                </ul>
            </div>
        </>
    )
}

export default Navbar;
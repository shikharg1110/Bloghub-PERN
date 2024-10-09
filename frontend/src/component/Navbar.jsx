import { useContext, useEffect, useState } from 'react';
import blogHubLogo from '../img/blogHubLogo.png';
import { IoMdSearch } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import { ImCancelCircle } from "react-icons/im";

const Navbar = () => {

    const [tagsOption, setTagsOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [menuClick, setMenuClick] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");
    const {user, setUser, userRole, setUserRole, hasPermission, setHasPermission} = useContext(UserContext);

    const deleteCookie = (cookieName) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }

    const handleSignOut = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/logout`, {
                withCredentials: true
            });
            if(response.status === 200) {
                toast.success("Successfully logged out");
                setUser(null);
                setUserRole(null);
                setHasPermission([]);
                deleteCookie('connect.sid');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        }
        catch(err) {
            if(err.response && err.response.status === 401) {
                console.log("User is not logged in");
                toast.error("User is not logged in");
            }
            else {
                console.error("Error logging out:", err);
                toast.error("Failed to log out");
            }
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        if(e.key === 'Enter' && searchTerm.length > 2) {
            const targetRoute = location.pathname === '/myBlog' ? '/myBlog' : '/';
            navigate(targetRoute, {state: {searchQuery: searchTerm}});
        }
        else if(e.key === 'Enter' && searchTerm.length <= 2) {
            const targetRoute = location.pathname === '/myBlog' ? '/myBlog' : '/';
            navigate(targetRoute, {state: {searchQuery: ""}});
        }
    }
    
    const getTagsOption = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getTagsOption`);
            console.log(response.data.rows[0]);
            setTagsOptions(response.data.rows);
        }
        catch(err) {
            console.log("Error in fetching tags: ", err);
        }
    }
    
    const handleTagSelect = (tagId) => {
        setSelectedTag(tagId);
        console.log("Selected tag: ",tagId);
        const targetRoute = location.pathname === '/myBlog' ? '/myBlog' : '/';
        navigate(targetRoute, {state: {searchQuery: "", selectedTag: tagId}})
    }

    // Split the tags into the first 5 and the rest
    const firstFiveTags = tagsOption.slice(0, 5);
    const remainingTags = tagsOption.slice(5);

    useEffect(() => {
        getTagsOption();
    }, []);

    const isSelectedTag = (tagId) => selectedTag === tagId;

    return (
        <>
            <header className='container d-flex justify-content-between mt-2 mb-2 gap-2 align-items-center'>
                <Link to="/">
                    <div className="logo" onClick={()=> setSelectedTag(null)}>
                        <img src={blogHubLogo} alt="BlogHub Logo"/> 
                    </div>
                </Link>
                <div className='d-flex align-items-center gap-2'>
                    <IoMdSearch size={30}/>
                    <input 
                        type="text" 
                        className='form-control' 
                        placeholder='Search blogs...' 
                        value={searchTerm} 
                        onChange={handleSearch}
                        onKeyDown={handleSearchSubmit}
                    />
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    {
                        user === 1 ? 
                        <>
                            <Link to='/adminPanel'>
                                <button className='btn btn-dark me-2' >Admin Panel</button>
                            </Link>
                            <Link to="/myBlog">
                                <button className='btn btn-dark me-2'>My blog</button>
                            </Link>
                            <Link to='/createBlog'>
                                <button className='btn btn-dark me-2' >Create Blog</button>
                            </Link>
                            <button className='btn btn-dark me-2' onClick={handleSignOut}>Sign Out</button>
                        </>
                        :
                        hasPermission.includes(1) === true ? 
                        <>
                            <Link to="/myBlog">
                                <button className='btn btn-dark me-2'>My blog</button>
                            </Link>
                            <Link to='/createBlog'>
                                <button className='btn btn-dark me-2' >Create Blog</button>
                            </Link>
                            <button className='btn btn-dark me-2' onClick={handleSignOut}>Sign Out</button>
                        </>
                        :
                            user !== null ?
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
            <div className="bg-dark text-light mb-2">
                <ul className='list-unstyled d-flex justify-content-between align-items-center mx-4 my-1'>
                    <li
                        style={{cursor: "pointer"}}
                        onClick={()=> {
                            setShowDropdown(!showDropdown)
                            setMenuClick(!menuClick);
                        }}
                        className='me-3'
                    >
                        {menuClick ? <ImCancelCircle size={30}/>: <IoMenu size={30}/>}
                        
                    </li>
                    {
                        firstFiveTags.map((tagOption) => (
                            <li
                                key={tagOption.tag_id}
                                className={`p-1 w-25 text-center ${isSelectedTag(tagOption.tag_id) ? 'bg-light text-dark': ''}`}
                                style={{cursor: "pointer"}}
                                onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "white"; 
                                        e.target.style.borderRadius = "10px"
                                        e.target.style.color = "black";
                                }}
                                onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "transparent";
                                        e.target.style.color = "white";
                                }}
                                onClick={() => handleTagSelect(tagOption.tag_id)}
                            >{tagOption.tag_name}</li>
                        ))
                    }
                </ul>
                {showDropdown && remainingTags.length > 0 && (
                    <ul className='list-unstyled bg-dark text-light mx-4'>
                        {remainingTags.map((tagOption, index) => (
                            <li
                                key={index}
                                className={`p-1 w-25 text-center ${isSelectedTag(tagOption.tag_id) ? 'bg-light text-dark': ''}`}
                                onClick={() => handleTagSelect(tagOption.tag_id)}
                                style={{cursor: "pointer"}}
                                onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "white"; 
                                        e.target.style.borderRadius = "10px"
                                        e.target.style.color = "black";
                                }}
                                onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "transparent";
                                        e.target.style.color = "white";
                                }}
                            >
                                {tagOption.tag_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Toaster />
        </>
    )
}

export default Navbar;
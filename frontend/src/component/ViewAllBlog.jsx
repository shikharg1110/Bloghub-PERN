import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewAllBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const searchQuery = location.state?.searchQuery || "";


    const handleReadAllBlog = async ( query = '') => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/readAllBlogs`, {
                params: { query }
            });
            setBlogs(response.data);
        }
        catch(err) {
            console.error("Error in reading all blogs: ",err);
        }
    }

    const handleReadBlog = async(blog) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/viewBlog/${blog.blog_id}`);
            navigate(`/viewBlog/${blog.blog_id}`);
        }
        catch(err) {
            console.error("Error in loading clicked blog", err);
        }
    }

    useEffect(() => {
        handleReadAllBlog(searchQuery);
    }, [searchQuery]);

    return (
        <>
            <div className="container mb-3">
                <div className="row gap-3 mx-auto">


            {
                blogs.map((blog, index) => (
                    
                    <div className="card col-4" style={{width: "22rem"}} key={index} onClick={() => handleReadBlog(blog)}>
                        <img src={`http://localhost:5000/images/${blog.img}`} className="card-img-top mt-3 card-img-style" alt="card image"/>
                        <div className="card-body">
                            <h5 className="card-title">{blog.title}</h5>
                            <p className="card-text">
                                {(
                                    (blog.body.length < 100) ? blog.body: (blog.body.substring(0, 100)+"...")
                                )}
                            </p>
                        </div>
                    </div>
                ))
            }
                </div>
            </div>
        </>
    );
}

export default ViewAllBlog;
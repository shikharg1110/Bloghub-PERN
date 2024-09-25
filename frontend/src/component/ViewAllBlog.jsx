import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewAllBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const searchQuery = location.state?.searchQuery || "";


    const handleReadAllBlog = async ( query = '', pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/readAllBlogs`, {
                params: { query, page: pageNumber, limit: 6 }
            });

            if(pageNumber === 1)
                setBlogs(response.data);
            else 
                setBlogs((prevBlogs) => [...prevBlogs, ...response.data]);

            setHasMore(response.data.length === 6);
            
            setLoading(false);
        }
        catch(err) {
            console.error("Error in reading all blogs: ",err);
            setLoading(false);
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

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage+1);
    }

    useEffect(() => {
        // setBlogs([]);
        setPage(1);
        handleReadAllBlog(searchQuery, 1);
    }, [searchQuery]);

    useEffect(() => {
        if(page > 1) {
            handleReadAllBlog(searchQuery, page);
        }
    }, [page]);

    return (
        <>
            <div className="container mb-3 me-auto">
                <div className="row d-flex justify-content-between align-items-center gap-2 flex-wrap">
                {
                    blogs.map((blog, index) => (    
                        <div className="col-3" key={index}>
                            <div className="card" onClick={() => handleReadBlog(blog)} style={{width:"100%"}}>
                                <img src={`http://localhost:5000/images/${blog.img}`} className="card-img-top" alt="card image" style={{height: "200px"}}/>
                                <div className="card-body">
                                    <h5 className="card-title">{blog.title}</h5>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
                {
                    hasMore && (<div className="text-center mt-4">
                    <button className="btn btn-dark" onClick={handleLoadMore} disabled={loading}>
                        {loading ? "Loading...": "Load More"}
                    </button>
                    </div>
                    )
                }
            </div>
        </>
    );
}

export default ViewAllBlog;
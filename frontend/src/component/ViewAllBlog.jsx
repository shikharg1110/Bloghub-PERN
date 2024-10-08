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
    const selectedTag = location.state?.selectedTag || null;
    console.log(selectedTag);


    const handleReadAllBlog = async ( query = '', tag = null, pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/readAllBlogs`, {
                params: { query, tag, page: pageNumber, limit: 6 }
            });

            if(pageNumber === 1)
                setBlogs(response.data);
            else 
                setBlogs((prevBlogs) => [...prevBlogs, ...response.data]);

            setHasMore(response.data.length === 6);
            
            setLoading(false);
        }
        catch(err) {
            if (err.response && err.response.status === 500) {
                console.log("Yes, 500 error");
            } else if (err.response) {
                console.error("Error response status:", err.response.status);
            } else {
                console.error("Error in reading all blogs:", err.message || err);
            }
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
        handleReadAllBlog(searchQuery, selectedTag, 1);
    }, [searchQuery, selectedTag]);

    useEffect(() => {
        if(page > 1) {
            handleReadAllBlog(searchQuery,selectedTag, page);
        }
    }, [page, selectedTag]);

    return (
        blogs.length > 0 ?
        <>
            <div className="container mb-3">
                <div className="row d-flex justify-content-between align-items-center gap-2 flex-wrap">
                {
                    blogs.map((blog, index) => (    
                        <div className="col-3" key={index}>
                            <div className="card" onClick={() => handleReadBlog(blog)} style={{width:"100%", height:"20rem", cursor: "pointer"}}>
                                <img src={`${import.meta.env.VITE_SERVER_DOMAIN}/images/${blog.img}`} className="card-img-top" alt="card image" style={{height: "200px"}}/>
                                {/* <img src={`http://localhost:5000/images/${blog.img}`} className="card-img-top" alt="card image" style={{height: "200px"}}/> */}
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
        :
        <div className="d-flex justify-content-center align-items-center">
            <h2 className="text-muted">No blog available</h2>
        </div>
    );
}

export default ViewAllBlog;
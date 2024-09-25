import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { dateToShow } from "../utility/formatDate";
import DOMPurify from 'dompurify';

const ViewBlog = () => {

        const {user, userRole, hasPermission} = useContext(UserContext);
        const navigate = useNavigate();
        const [image, setImage] = useState(null);
        const [title, setTitle] = useState("");
        const [body, setBody] = useState("");
        const [timeCreated, setTimeCreated] = useState("");
        const [blogId, setBlogId] = useState(null);
        const [authorId, setAuthorId] = useState(null);

        const {id} = useParams();
        const handleViewBlog = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/viewBlog/${id}`);
                console.log(response.data[0]);
                setTitle(response.data[0].title);
                setBody(response.data[0].body);
                setImage(response.data[0].img);
                setTimeCreated(response.data[0].created_at);
                setBlogId(id);

                const checkAuthor = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getUserByBlogId/${id}`);
                console.log(checkAuthor.data.rows[0]);
                setAuthorId(checkAuthor.data.rows[0].user_id);

            }
            catch(error) {
                console.error(error);
            }
        }

        const handleDelete = async() => {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/deleteBlog/${id}`, {withCredentials: true});
                console.log(response);
                navigate(`/`);
            }
            catch(err) {
                console.log(err);
            }
        } 

        useEffect(() => {
            handleViewBlog();
        }, [id]);
    return (
        <>
            <div className="container">
                <div className="title mt-4">
                    <h3 className="fs-2">{title}</h3>
                </div>
                <div className="time">
                    <p className="fs-7">Written at: {dateToShow(timeCreated)}</p>
                </div>
                <div className="image text-center align-content-center d-flex justify-content-center mt-3">
                    <img src={`http://localhost:5000/images/${image}`} alt="Blog Banner" className="img-fluid rounded-3 mb-2 w-50 text-center"/>
                </div>
                <div className="body">
                    {/* <p className="fs-6">{body}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} className="fs-6" />
                </div>
                <div>
                    {
                        user === authorId ?
                        <>
                            <Link to={`/editBlog/${blogId}`}>
                                <button className='btn btn-dark me-2 mb-3'>Edit Blog</button>
                            </Link>
                            <button className='btn btn-dark me-2 mb-3' onClick={handleDelete}>Delete Blog</button>
                        </>
                        :
                        hasPermission.includes(2) && hasPermission.includes(3) ?
                            <>
                            <Link to={`/editBlog/${blogId}`}>
                                <button className='btn btn-dark me-2 mb-3'>Edit Blog</button>
                            </Link>
                            <button className='btn btn-dark me-2 mb-3' onClick={handleDelete}>Delete Blog</button>
                            </>
                        :
                        hasPermission.includes(2) ?
                            <Link to={`/editBlog/${blogId}`}>
                                <button className='btn btn-dark me-2 mb-3'>Edit Blog</button>
                            </Link>
                        :
                        hasPermission.includes(3) ?
                        <button className='btn btn-dark me-2 mb-3' onClick={handleDelete}>Delete Blog</button>
                        :
                        ""
                    }
                </div>
            </div>

        </>
    );
}

export default ViewBlog;
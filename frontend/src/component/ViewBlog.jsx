import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";

const ViewBlog = () => {

        const {userRole} = useContext(UserContext);
        const navigate = useNavigate();
        const [image, setImage] = useState(null);
        const [title, setTitle] = useState("");
        const [body, setBody] = useState("");
        const [timeCreated, setTimeCreated] = useState("");
        const [blogId, setBlogId] = useState(null);
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
                <div className="image text-center align-content-center d-flex justify-content-center mt-3">
                    <img src={`http://localhost:5000/images/${image}`} alt="Blog Banner" className="img-fluid rounded-3 mb-2 w-50 text-center"/>
                </div>
                <div className="title mt-4">
                    <h3 className="fs-2">{title}</h3>
                </div>
                <div className="time">
                    <p className="fs-7">Written at: {timeCreated}</p>
                </div>
                <div className="body">
                    <p className="fs-6">{body}</p>
                </div>
                <div>
                    {
                        userRole === 'author' || userRole === 'admin' ?
                        <>
                        <Link to={`/editBlog/${blogId}`}>
                            <button className='btn btn-dark me-2 mb-3'>Edit Blog</button>
                        </Link>
                        <button className='btn btn-dark me-2 mb-3' onClick={handleDelete}>Delete Blog</button>
                        </>
                        :
                        ""
                    }
                </div>
            </div>

        </>
    );
}

export default ViewBlog;
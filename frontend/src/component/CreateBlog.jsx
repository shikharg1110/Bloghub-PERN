import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";

const CreateBlog = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tag, setTag] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUploadImage = async () => {
        if(file) {
            const formData = new FormData();
            formData.append('fileInput', file);
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
                setFileName(response.data)
                console.log(response.data); 
                if(response.status == 200)
                    toast.success("Uploaded successfully");
                else
                    toast.error("Not Uploaded");
            } 
            catch (error) {
                if(error.response && error.response.status === 401) {
                    toast.error("Log in to upload the image");
                    navigate('/login');
                }
                else {
                    console.error("Error: ", error);
                    toast.error("Failed in uploading the image");
                }
            }
        }
    }

    const handleCreateBlog = async() => {
        if(fileName) {
            if(title !== "" && body !== "" && tag != "") {
                await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/createBlog`, {
                    title: title,
                    body: body,
                    tag: tag,
                    img: fileName
                },{
                    withCredentials: true
                })
                .then((res) => {
                    if(res.status === 200) {
                        toast.success("Blog created successfully");
                        viewBlogbyId(res.data.rows[0].blog_id);
                    }
                    else {
                        toast.error("blog does not created");
                    }
                })
                .catch((err) => {
                    if(err.response && err.response.status === 401) {
                        toast.error("Log in to create the blog");
                        navigate('/login');
                    }
                    else if(err.response && err.response.status === 403) {
                        toast.error("You are not authorized to create the blog");
                        navigate('/');
                    }
                    else {
                        console.log("Error in blog creation: ", err);
                        toast.error('Failed in creating the blog. Try again');
                    }
                });
            }
            else if(title === "") {
                toast.error("Title should not be empty");
            }
            else if(body === "") {
                toast.error("Body should not be empty");
            }
            else if(tag === "") {
                toast.error("Tag should not be empty");
            }
        }
        else {
            toast.error("image upload incomplete");
            console.error("image upload incomplete");
        }
    }

    const viewBlogbyId = async(id) => {
        console.log(id);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/viewBlog/${id}`);
            console.log(response.data);
            navigate(`/viewBlog/${id}`);
        }
        catch(err) {
            console.error("Error in loading blog", err);
            toast.error("Error in loading blog", err);
        }
    }
    return (
        <>
            <div className="container">
                <div className="mb-3">
                    <label htmlFor="titleInput" className="form-label">Title</label>
                    <input type="text" className="form-control" id="titleInput" onChange={(e) => {setTitle(e.target.value)}}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="bodyInput" className="form-label">Body</label>
                    {/* <textarea className="form-control" id="bodyInput" rows="3" onChange={(e) => {setBody(e.target.value)}}></textarea> */}
                    <ReactQuill 
                        theme="snow" 
                        value={body} 
                        onChange={setBody}
                        modules={{
                            toolbar: [
                                [{'font': []}],
                                ['bold', 'italic', 'underline'],
                                [{'list': "ordered"}, {'list': 'bullet'}],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}    
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tagInput" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tagInput" onChange={(e) => {setTag(e.target.value)}}/>
                </div>
                <div className="mb-3">
                    <input type="file" name="fileInput" id="fileInputId" onChange={handleFileChange}/>
                    <button type="button" onClick={handleUploadImage}>Upload</button>
                </div>
                <button className="btn btn-dark" onClick={() => handleCreateBlog()}>Create Blog</button>
                <Toaster />
            </div>
        </>
    );  
}

export default CreateBlog;
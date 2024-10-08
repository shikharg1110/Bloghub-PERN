import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";
import UserContext from "../context/UserContext";
import NotAuthorised from "./NotAuthorised";

const CreateBlog = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tag, setTag] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [tagsOptions, setTagsOptions] = useState([]);
    const [ selectedTag, setSelectedTag] = useState("");

    const {hasPermission} = useContext(UserContext);

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
            if(title !== "" && body !== "" && selectedTag != "") {
                await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/createBlog`, {
                    title: title,
                    body: body,
                    tag: selectedTag,
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

    useEffect(() => {
        getTagsOption();
    }, []);

    return (
        hasPermission.includes(1) === true ?
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
                    {/* <label htmlFor="tagInput" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tagInput" onChange={(e) => {setTag(e.target.value)}}/> */}
                    <label htmlFor="tagNameEdit" className="form-label">Select Tag</label>
                        <select 
                            name="tagNameEdit" 
                            id="tagNameEdit"
                            className="form-control"
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            <option value="">Select Tag</option>
                            {
                                tagsOptions.map(tagOption => (
                                    <option key={tagOption.tag_id} value={tagOption.tag_id}>{tagOption.tag_name}</option>
                                ))
                            }
                        </select>
                </div>
                <div className="mb-3">
                    <input type="file" name="fileInput" id="fileInputId" onChange={handleFileChange}/>
                    <button type="button" onClick={handleUploadImage}>Upload</button>
                </div>
                <button className="btn btn-dark" onClick={() => handleCreateBlog()}>Create Blog</button>
                <Toaster />
            </div>
        </>
        :
        <NotAuthorised />
    );  
}

export default CreateBlog;
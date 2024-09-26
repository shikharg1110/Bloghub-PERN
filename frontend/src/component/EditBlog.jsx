import axios from "axios";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, {Toaster} from 'react-hot-toast';

const EditBlog = () => {

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
                toast.success('Uploaded Successfully');  
            } 
            catch (error) {
                toast.error("Error in uploading image");
                console.error("Error in uploading image: ", error);
            }
        }
    }

    const {id} = useParams();

    const handleEditBlog = async() => {
        if(fileName) {

            await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/editBlog/${id}`, {
                title: title,
                body: body,
                tag: tag,
                img: fileName
            }, {withCredentials: true})
            .then((res) => {
                if(res.status === 200) {
                    console.log(res);
                    toast.success("Blog updated successfully");
                    navigate(`/viewBlog/${id}`);
                }
            })
            .catch((err) => {
                toast.error("Error in editing the blog");
                console.log("Error in editing the blog: ", err);
            });
        }
        else {
            toast.error("Image upload complete");
            console.error("image upload incomplete");
        }
    }

    const handleTitle = async() => {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/viewBlog/${id}`);
        setTitle(response.data[0].title);
        setBody(response.data[0].body);
        setTag(response.data[0].tag);
        console.log(response);
    }

    useEffect(() => {
        handleTitle();
    }, [])

    return (
        <>
            <div className="container">
                <div className="mb-3">
                    <label htmlFor="titleInput" className="form-label">Title</label>
                    <input 
                        type="text"
                        className="form-control" 
                        id="titleInput" 
                        value={title} 
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="bodyInput" className="form-label">Body</label>
                    {/* <textarea 
                        className="form-control" 
                        id="bodyInput" 
                        rows="3" 
                        value={body} 
                        onChange={(e) => {
                            setBody(e.target.value);
                        }}
                    ></textarea> */}
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
                    <input 
                        type="text" 
                        className="form-control"
                        id="tagInput" 
                        value={tag} 
                        onChange={(e) => {
                            setTag(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <input type="file" name="fileInput" id="fileInputId" onChange={handleFileChange}/>
                    <button type="button btn btn-dark " onClick={handleUploadImage}>Upload</button>
                </div>
                <button className="mb-3 btn btn-dark " onClick={() => handleEditBlog()}>Edit Blog</button>
                <Toaster />
            </div>
        </>
    );  
}

export default EditBlog;
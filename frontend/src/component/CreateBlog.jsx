import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                    alert("Uploaded successfully");
                else
                    alert("Not Uploaded");
            } 
            catch (error) {
                if(error.response && error.response.status === 401) {
                    alert("Log in to upload the image");
                    navigate('/login');
                }
                else {
                    console.error("Error: ", error);
                    alert("Failed in uploading the image");
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
                        alert("Blog created successfully");
                        viewBlogbyId(res.data.rows[0].blog_id);
                    }
                    else {
                        alert("blog does not created");
                    }
                })
                .catch((err) => {
                    if(err.response && err.response.status === 401) {
                        alert("Log in to create the blog");
                        navigate('/login');
                    }
                    else if(err.response && err.response.status === 403) {
                        alert("You are not authorized to create the blog");
                        navigate('/');
                    }
                    else {
                        console.log("Error in blog creation: ", err);
                        alert('Failed in creating the blog. Try again');
                    }
                });
            }
            else if(title === "") {
                alert("Title should not be empty");
            }
            else if(body === "") {
                alert("Body should not be empty");
            }
            else if(tag === "") {
                alert("Tag should not be empty");
            }
        }
        else {
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
                    <textarea className="form-control" id="bodyInput" rows="3" onChange={(e) => {setBody(e.target.value)}}></textarea>
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
            </div>
        </>
    );  
}

export default CreateBlog;
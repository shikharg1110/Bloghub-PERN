import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast, {Toaster} from 'react-hot-toast';
import { dateToShow } from "../utility/formatDate";
import { MdDelete } from "react-icons/md";
import UserContext from "../context/UserContext";
import NotAuthorised from "./NotAuthorised";

const ManageTag = () => {
    const [ tagName, setTagName ] = useState("");
    const [ tagsOptions, setTagsOptions] = useState([]);
    const [ selectedTag, setSelectedTag] = useState("");
    const [ renameTag, setRenameTag] = useState("");
    const [ isHover, setIsHover ] = useState(null);

    const {user} = useContext(UserContext);

    const handleCreateTag = async (e) => {
        e.preventDefault();
        try {
            const createTag = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/createTag`, {
                tag: tagName
            })
            console.log(createTag);
            if(createTag.status === 200) {
                toast.success("Tag created successfully");
                setTagName("");
                getTagsOption();
            }

            else {
                toast.error("Tag is not created");
            }
        }
        catch(err) {
            toast.error("Failed to create the tag");
            console.error("Error in creating the tag:",err);
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

    const handleEditTag = async(e) => {
        e.preventDefault();
        console.log(selectedTag);
        console.log(renameTag);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/editTag`, {
                tagId: selectedTag,
                tagName: renameTag
            });
            if(response.status === 200) {
                console.log(response);
                toast.success("Tag renamed successfully");
                const updatedTagsOptions = tagsOptions.map(tag => 
                    tag.tag_id === selectedTag ? { ...tag, tag_name: renameTag } : tag
                );
                setTagsOptions(updatedTagsOptions);
                setRenameTag("");
                setSelectedTag("");
                getTagsOption();
            }
        }
        catch(err) {
            console.log("Error in renaming the tag: ", err);
        }
    }

    const confirmEdit = (e) => {
        e.preventDefault();
        toast((t) => (
            <span>
                Are you sure you want to edit <b>{e.tag_name}</b> ?
                <div style={{marginTop: "10px"}}>
                    <button 
                        style={{marginRight: "10px"}}
                        onClick={async() => {
                            await handleEditTag(e);
                            toast.dismiss(t.id);
                        }}
                        className="btn btn-light"
                    > Yes </button>
                    <button onClick={() => toast.dismiss(t.id)} className="btn btn-light">Cancel</button>
                </div>
            </span>
        ))
    }

    const confirmDelete = (e) => {
        toast((t) => (
            <span>
                Are you sure you want to delete <b>{e.tag_name}</b> ?
                <div style={{marginTop: "10px"}}>
                    <button 
                        style={{marginRight: "10px"}}
                        onClick={async() => {
                            await handleTagDelete(e);
                            toast.dismiss(t.id);
                        }}
                        className="btn btn-light"
                    > Yes </button>
                    <button onClick={() => toast.dismiss(t.id)} className="btn btn-light">Cancel</button>
                </div>
            </span>
        ))
    }

    const handleTagDelete = async(e) => {
        console.log(e);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/deleteTagById`, {
                tagId: e.tag_id
            });

            if(response.status === 200) {
                console.log(response);
                const updatedTagsOptions = tagsOptions.filter(tag => tag.tag_id !== e.tag_id);
                setTagsOptions(updatedTagsOptions);
                toast.success("Tag deleted Successfully");
            }
            else {
                toast.error("Failed to delete tag");
            }
        }
        catch(err) {
            console.error(err);
            toast.error("An error occurred while deleting the tag");
        }
    }

    useEffect(() => {
        getTagsOption();
    }, []);

    return (
        user === 1 ?
        <div className="container">
            <div className="mb-3">
                <h1>Create Tag</h1>
                <form id="createTagForm" onSubmit={handleCreateTag}>

                    <div className="mb-3">
                        <label htmlFor="tagNameInput" className="form-label">Tag Name</label>
                        <input type="text" className="form-control" id="tagNameInput" value={tagName} onChange={(e)=> setTagName(e.target.value)}/>
                    </div>
                    
                    <button className="btn btn-dark" type="submit">Create Tag</button>
                </form>
            </div>

            <br />
            <br />

            <div className="mb-3">
                <h1>Edit Tag</h1>
                <form id="editTagForm" onSubmit={confirmEdit}>

                    <div className="mb-3">
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
                        <label htmlFor="editTagName" className="form-label mt-2">Rename</label>
                        <input type="text" id="editTagName" className="form-control" placeholder="Write here..." value={renameTag} onChange={(e) => setRenameTag(e.target.value)}/>
                    </div>
                    <button className="btn btn-dark" type="submit">Edit Tag</button>
                </form>
            </div>
            <br />
            <br />
            <div className="mb-3">
                <h1>Tag List: {tagsOptions.length}</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">S.No.</th>
                            <th scope="col">Tag Name</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Update At</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tagsOptions.map((tagOption, index) => (
                                <tr key={tagOption.tag_id}>
                                    <td>{tagOption.tag_id}</td>
                                    <td>{tagOption.tag_name}</td>
                                    <td>{dateToShow(tagOption.created_at)}</td>
                                    <td>{dateToShow(tagOption.updated_at)}</td>
                                    <td 
                                        style={{cursor: "pointer"}}
                                        onClick={() =>confirmDelete(tagOption)}
                                        onMouseEnter={() => setIsHover(tagOption.tag_id)}
                                        onMouseLeave={() => setIsHover(null)}
                                    >
                                        <MdDelete size={25} color={isHover === tagOption.tag_id ? 'red': 'black'} />
                                    </td>
                                </tr>
                                
                            ))
                        }

                    </tbody>
                </table>

            </div>
                
            <Toaster />
        </div>
        :
        <NotAuthorised />
    );
}

export default ManageTag;

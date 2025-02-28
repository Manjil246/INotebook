import React, {useContext,useState} from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
    const context = useContext(noteContext)
    const {addNote} = context;
    const [note, setNote] = useState({title:"",description:"",tag:""})

    const onChange = (e) =>{
        setNote({...note,[e.target.name] : e.target.value})
    }

    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""});
        props.showAlert('success',"Added Successfully")
    }
   

return (
<div className="container my-3">
    <h1>Add a Note</h1>
    <form className="my-3">
        <div className="mb-3">
            <label htmlFor="title" className="form-label">
                Title
            </label>
            <input type="text" className="form-control" id="title" name="title" onChange={onChange} value={note.title} minLength={5} required />
            <div id="emailHelp" className="form-text">

            </div>
        </div>
        <div className="mb-3">
            <label htmlFor="desc" className="form-label">
                Description
            </label>
            <input type="text" className="form-control" id="desc" name="description" onChange={onChange} value={note.description} minLength={5} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="tag" className="form-label">
                Tag
            </label>
            <input type="text" className="form-control" id="tag" name="tag" onChange={onChange} value={note.tag} minLength={5} required/>
        </div>
        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>
            Add Note
        </button>
    </form>
</div>
);
};

export default AddNote;
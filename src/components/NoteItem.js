import React, {useContext} from 'react'
import noteContext from "../context/notes/noteContext";

const NoteItem = (props) => {
    const context = useContext(noteContext)
    const {deleteNote} = context;
    const {note,updateNote,showAlert} = props;
return (
    <div className='col-md-3 my-3'>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-bold">{note.title}</h5>
                <p className="card-text">{note.description}</p>
                <i className="fa-solid fa-trash-can mx-2" onClick={()=>{deleteNote(note._id);     props.showAlert('success',"Deleted Successfully")}}></i>
                <i className="fa-regular fa-pen-to-square mx-2" onClick={()=>{updateNote(note); }}></i>
            </div>
        </div>
    </div>
)
}

export default NoteItem
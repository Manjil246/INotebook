import NoteContext from './noteContext.js'
import { useState } from 'react'

const NoteState = (props) =>{
  const host = "http://localhost:5000"
    const notesInitial = [];

    const [notes, setNotes] = useState(notesInitial)



    //get all a notes
    const getNotes = async ()=>{
      //API call
      const response =await fetch(`${host}/notes/fetchallnotes`,{
        method : 'GET',
        headers : {
          'Content-Type':'application/json',
          "auth-token": localStorage.getItem('token')
        }

      });
      const json = await response.json();
      setNotes(json)

  }

    //Add a note
    const addNote = async (title,description,tag)=>{
        //API call
        const response =await fetch(`${host}/notes/addnote`,{
          method : 'POST',
          headers : {
            'Content-Type':'application/json',
            "auth-token": localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag}),
          
        });
        const note =  await response.json();
        setNotes(notes.concat(note));
    }

    //Delete a note
    const deleteNote = async (id)=>{
        //API call
        const response =await fetch(`${host}/notes/deletenote/${id}`,{
          method : 'DELETE',
          headers : {
            'Content-Type':'application/json',
            "auth-token": localStorage.getItem('token')
          }
          
        });
        const json =  await response.json();
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
    }

    //Edit a Note 
    const editNote = async (id,title,description,tag)=>{
          //API call
          const response =await fetch(`${host}/notes/updatenote/${id}`,{
            method : 'PUT',
            headers : {
              'Content-Type':'application/json',
              "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}),
            
          });
          const json =  await response.json(); 



          let newNotes = JSON.parse(JSON.stringify(notes))
          //logic to edit in client
          for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
              newNotes[index].title = title;
              newNotes[index].description = description;
              newNotes[index].tag = tag;
              break;
            }
          }
          setNotes(newNotes)
    }

    return(
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
const express = require('express')
const router = express.Router()
var fetchuser = require('../middleware/fetchuser.js')
const Note = require("../models/Note.js")
const { body, validationResult } = require('express-validator');

//Route 1:- fetch all notes using: GET '/notes/getallnotes' .login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id})
    res.send(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Some unexpected error Occured"});
    }
})

//Route 2:- add a new node using: POST '/notes/addnote' .login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Enter a valid description').isLength({min:5})
],async (req,res)=>{

    try {
        const {title,description,tag} = req.body;

    // If there are errors, return bad requests and the errrors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    } 

    const note = new Note({
        title,description,tag,user:req.user.id
    })
    const savedNote = await note.save()

    res.send(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Some unexpected error Occured"});
    }
})


//Route 3:- update an existing note using: PUT '/notes/update note' .login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{

    try {
        const {title,description,tag} = req.body;

        const newnote = {};
        if(title){
            newnote.title=title;
        }
        if(description){
            newnote.description=description;
        }
        if(tag){
            newnote.tag=tag;
        }

        //find the note to be updated
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }

        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findOneAndUpdate({_id:req.params.id},{$set:newnote},{new:true})

        res.send(note)

    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Some unexpected error Occured"});
    }
})



//Route 4:- delete an existing note using: DELETE '/notes/deletenote' .login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{

    try {

        //find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }

        //Allow deletion only if user owns the note
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete({_id:req.params.id})

        res.json({"Success":"Note has been deleted successfully",note:note})

    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Some unexpected error Occured"});
    }
})

module.exports = router
import express from "express";
import Note from "../models/Note.js";
import authMiddleware from '../middleware/middleware.js'

const router = express.Router()

//for adding note
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const note = await Note.create({
            title,
            description,
            userId: req.user.id
        })
        return res.status(200).json({ success: true, message: "Note added successfully.", id: note._id })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." })
    }

})

//for deleting note
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.id

        const note = await Note.findById(noteId)
        if (note.userId != req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        await Note.findByIdAndDelete(noteId)
        return res.status(200).json({ success: true, message: "Note deleted successfully.", id: note._id })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." })
    }

})


//for getting all notes of a user
router.get('/getall', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id

        const notes = await Note.find({userId})
        //console.log(notes)
        
        return res.status(200).json({ success: true, message: "Note fetched successfully.",notes })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." })
    }

})


//for updating note
router.put('/edit/:id', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.id
        const {title,description}=req.body

        const note = await Note.findById(noteId)
        if (note.userId != req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        const updatedNote= await Note.findByIdAndUpdate(noteId,{title,description},{new:true})

        return res.status(200).json({ success: true, message: "Note updated successfully.", updatedNote })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." })
    }

})


// 1. Create: Method: POST
// 2. Read: Method: GET
// 3. Update: Method: PUT
// 4. Delete: Method: DELETE
export default router
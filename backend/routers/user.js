const express = require('express')
const router = express.Router()
const bCrypt = require("bcrypt")
const User = require("../models/user")
const mongoose = require("mongoose")

//get all users
router.get("/", async (req, res) => {
    const usersList = await User.find().select("-passwordHash")

    if (!usersList) {
        res.status(500).json({ success: false })
    } else {
        res.send(usersList);
    }
})


//post a new user
router.post('/', async (req, res) => {
    const { name, email, isAdmin, phone } = req.body
    const newUser = new User({ name, email, isAdmin, phone, passwordHash: bCrypt.hashSync(req.body.password, 10) })

    newUser.save()
    if (!newUser) {
        res.status(500).json({ msg: "can't save" })
    }
    res.status(200).json(newUser)
})

//get a single user by id
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id).select("-passwordHash").
        catch((err) => {
            return res.status(500).send(err)
        })
    if (!user) {
        return res.status(400).json({ msg: "no cat with this id" })
    } else {
        return res.status(200).json(user)
    }

})


//update user
router.put("/:id", async (req, res) => {
    const id = req.params.id
    const { name, email, isAdmin, phone } = req.body

    const userExist = await User.findById(id)
    let newPassword

    if (req.body.password) {
        newPassword = bCrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash
    }

    const user = await User.findOneAndUpdate(id, { name, email, isAdmin, phone, passwordHash: newPassword }, { new: true }).catch(err => {
        return res.status(500).send(err)
    })
    if (!user) {
        return res.status(400).json({ msg: "no user with this id" })
    } else {
        return res.status(200).json(user)
    }
})


module.exports = router
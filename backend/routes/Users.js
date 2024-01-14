const express = require('express');
const router = express.Router();
const {Users} = require('../models');
const bcrypt = require('bcrypt');
const {validateToken} = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");


//POST OR REGISTER USER NADI HA GIN CHATGPT KO ANG CHECK IF USER EXIST KAY NATAMAD NAK O GINAGO
router.post("/", async (req, res) => {
    try {
        const { username, password, role} = req.body;
        const existingUser = await Users.findOne({ where:{username: username} });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists!" });
        }
  
        bcrypt.hash(password, 10).then((hash) => {
            Users.create({
                username: username,
                password: hash,
                role: role,
            });
  
            res.json("success");
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

// DISPLAY ALL SHITS MATE GINAGO KA KARON
router.get('/', async(req,res)=>{
    try{
        const users = await Users.findAll();
        res.status(200).json(users)
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message})
    }
});

// DISPLAY BY ID
router.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    const users = await Users.findByPk(id);
    res.json(users);
})

// UPDATE BY ID GINAGO LIWAT DA AH NA TUYO KANA BALA
router.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { username, password, role } = req.body;

    try {
        const users = await Users.findByPk(id);

        if (users) {
            users.username = username;
            users.password = password;
            users.role = role;

            await users.save();

            res.status(200).json(users); // Sending the updated user back in the response
        } else {
            return res.status(404).json({ error: "User not found ah ginago tudo" });
        }
    } catch (error) {
        console.log("error updating user", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// DELETE BY ID GINAGO AH
router.delete('/:id', async(req,res)=>{
    const id = req.params.id;

    try{
        const users = await Users.findByPk(id);

        if(users){
            await users.destroy();
            res.status(204).send();
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: error.message});
    }
})

module.exports = router;
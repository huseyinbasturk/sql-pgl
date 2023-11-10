const express = require('express');
const UserRepo = require('../repos/user-repo');

const router = express.Router();

router.get('/users', async (req, res) => {
    //run a query to get all users
    const users = await UserRepo.find();

    users[0].created_at;

    //send the result back to the person
    //who made the request
    res.send(users);
});

router.get('/users/:id', async (req, res) => {
    const {id} = req.params;

    const user = await UserRepo.findById(id);

    if(user) {
        res.send(user);
    } else {
        res.sendStatus(404);
    }
});

router.post('/users', async (req, res) => {});

router.put('/users/:id', async (req, res) => {});

router.delete('/users/:id', async (req, res) => {});

module.exports = router;

const { fetchUsers } = require('../models/users')

exports.getUsers = (req, res) => {
    
    fetchUsers()
    .then((users) => {        
        return res.status(200).send({ users })
    })
}
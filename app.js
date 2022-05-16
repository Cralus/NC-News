const express = require('express')
const app = express();
const {getTopics } = require('./controllers/topics.js')

app.get('/api/topics', getTopics)

app.get('/api*', (req, res) =>{
    res.status(404).send({msg: 'Bad endpoint'})
})
module.exports = app
const db = require('../db/connection');

exports.fetchTopics = () => {
    console.log('hello')

    return db
    .query(
        `SELECT * FROM topics`
    )
    .then((response) => {
        console.log(response.rows)
        return response.rows
        
    })
}
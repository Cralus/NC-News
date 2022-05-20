const {fetchTopics} =  require('../models/topics')

exports.getTopics = (req, res) => {
    
    fetchTopics()
    .then((topics) => {
        
        return res.status(200).send({ topics })
    })
}


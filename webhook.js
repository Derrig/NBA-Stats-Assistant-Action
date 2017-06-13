/**
 * webhook.js listens for requests and sends them to them
 * to the proper handler in handlers.js
 */

const stats = require('./stats.js')
const handlers = require('./handlers.js')
const express = require('express')
const bodyParser = require('body-parser')
const rest = express()

rest.use(bodyParser.json())

rest.post('/hook', function (req,res){
    console.log('hook request')
    var reqBody = req.body
    var intent = reqBody.result.metadata.intentName
    switch(intent){
        case ('NBA Scores'):
            handlers.scores(reqBody,res)
            break
        case ('Stats Per Game'):
            handlers.statsPerGame(reqBody,res)
            break
        case('True Shooting'):
            handlers.trueShooting(reqBody,res)
            break
        default:
            res.json({
                    speech:'I\'m not sure what you are asking.',
                    displayText:'I\'m not sure what you are asking.',
                    source:''
            })
    }
})

rest.listen(process.env.PORT || 5000, () => {
    console.log('now listening...')
})

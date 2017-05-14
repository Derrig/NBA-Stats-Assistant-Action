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
    //console.log(reqBody)
    if(intent === 'NBA Scores'){
        handlers.scores(reqBody,res,req.timestamp)
    }
    else if(intent === 'Points Per Game'){
        handlers.ppg(reqBody,res)
    }
    else if(intent === 'Rebounds Per Game'){
        //handlers.rpg(reqBody,res)
    }
    else{
        res.json({
            speech:'I\'m not sure what you are asking.',
            displayText:response,
            source:'stats.nba.com'
        })
    }
})

rest.listen(process.env.PORT || 5000, () => {
    console.log('now listening...')
})

//reference:
//https://github.com/api-ai/apiai-webhook-sample
const stats = require('./stats.js')
const express = require('express')
const bodyParser = require('body-parser')


const rest = express()
rest.use(bodyParser.json())

rest.post('/hook', function (req,res){
    console.log('hook request');
    var reqBody = req.body;
    //console.log(reqBody)
    if(reqBody.result.metadata.intentName === 'NBA Scores'){
        if(reqBody.result.parameters.date === ''){ //FIX THIS DEFAULT DATE!!!
            var dateObj = new Date()
            var date = dateObj.toISOString().substring(0,10).replace(/-/g,'')
            console.log(date)
        }
        else{
            var date = reqBody.result.parameters.date
        }
        console.log(date)
        date = date.replace(/-/g,'')
        stats.games(date).then(response => {
            res.json({
                speech:response,
                displayText:response,
                source:'stats.nba.com'
            })
        })
    }
    else{ //ppg
        var givenName = reqBody.result.parameters['given-name']
        var lastName = reqBody.result.parameters['last-name']
        var nbaName = reqBody.result.parameters['NBA_Name']

        if(nbaName !== ""){
            stats.tester(stats.getID(nbaName))
                .then(function response(ppg){
                    var response = nbaName + ' averaged '
                                   + ppg + ' points per game in his peak NBA season.'
                    res.json({
                        speech:response,
                        displayText:response,
                        source:'stats.nba.com'
                    })
                })
        }
        else{
            stats.tester(stats.getID(givenName + ' ' + lastName))
                .then(function response(ppg){
                        var response = givenName + ' ' + lastName + ' averaged '
                                       + ppg + ' points per game in his peak NBA season.'
                        res.json({
                            speech:response,
                            displayText:response,
                            source:'stats.nba.com'
                        })
                })
        }
    }
})



rest.listen(process.env.PORT || 5000, () => {
    console.log('now listening...')
})

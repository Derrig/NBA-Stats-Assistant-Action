/**
 * handlers.js parses the input, makes the neccessary calls to stats.nba.com,
 * and passes the response to stats.js function, and sends the string response
 * from stats.js back to api.ai.
 */

const nba = require('nba.js').default
const stats = require('./stats.js')
const moment = require('moment')

function conError(res){
    return 'Sorry, I\'m having trouble connecting to stats.nba.com!'
}

exports.scores = function(reqBody,res,timestamp){
    if(reqBody.result.parameters.date === ''){ //use cur date if none provided
        var dateObj = moment(timestamp) //utc time
        dateObj.subtract(4,'hours')    //change to EST time
        if(dateObj.hours() <= 3){ //display yesterday if earlier than 4:00 EST
            m.subtract(1,'days')
        }
        date = dateObj.format('YMMDD') //change to 20170504 format
    }
    else{
        var date = reqBody.result.parameters.date
        date = date.replace(/-/g,'') //change to 20170504 format
    }
    console.log(date)
    nba.data.scoreboard({date:date}).then(stats.genGames, conError)
        .then(response => {
            res.json({
                speech:response,
                displayText:response,
                source:'stats.nba.com'
            })
        })
}

exports.ppg = function(reqBody,res){
    var nbaName = reqBody.result.parameters['NBA_Name']
    var pid = stats.getID(reqBody.result.parameters['NBA_Name'])
    nba.stats.playerCareerStats({PerMode:'PerGame',PlayerID:pid})
             .then(res => stats.ppg(nbaName,res))
             .then(response => {
                 res.json({
                     speech:response,
                     displayText:response,
                     source:'stats.nba.com'
                 })
             })
}

//unimplemented
exports.rpg = function(reqBody,res){
    var givenName = reqBody.result.parameters['given-name']
    var lastName = reqBody.result.parameters['last-name']
    var nbaName = reqBody.result.parameters['NBA_Name']

}

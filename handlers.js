/**
 * handlers.js parses the input, makes the neccessary calls to stats.nba.com,
 * and passes the response to stats.js function, and sends the string response
 * from stats.js back to api.ai.
 */

const nba = require('nba.js').default
const stats = require('./stats.js')
const error = require('./error.js')
const moment = require('moment')

function conError(res){
    return 'Sorry, I\'m having trouble connecting to stats.nba.com!'
}

exports.scores = function(reqBody,res){
    var timestamp = reqBody.result.timestamp
    var date
    if(reqBody.result.parameters.date === ''){ //use cur date if none provided
        var dateObj = moment(timestamp) //utc time
        dateObj.subtract(4,'hours')    //change to EST time
        if(dateObj.hours() <= 3){ //display yesterday if earlier than 4:00 EST
            dateObj.subtract(1,'days')
        }
        date = dateObj.format('YMMDD') //change to 20170504 format
    }
    else{
        date = reqBody.result.parameters.date
        date = date.replace(/-/g,'') //change to 20170504 format
    }
    console.log(date)
    nba.data.scoreboard({date:date})
        .then(result => stats.genGames(result,date),error.scoresError)
        .then(response => {
            res.json({
                speech:response,
                displayText:response,
                source:'stats.nba.com'
            })
        })
}

exports.statsPerGame = function(reqBody,res){
    var nbaName = reqBody.result.parameters['NBA_Name']
    var season = reqBody.result.parameters['NBA_Season']
    var stat = reqBody.result.parameters['Stat_Type_Per_Game']
    var pid = stats.getID(nbaName)

    nba.stats.playerCareerStats({PerMode:'Totals',PlayerID:pid})
             .then(result => stats.genStatsPerGame(nbaName,season,stat,result))
             .then(response => {
                 res.json({
                     speech:response,
                     displayText:response,
                     source:'stats.nba.com'
                 })
             })
}

exports.trueShooting = function(reqBody,res){
    var nbaName = reqBody.result.parameters['NBA_Name']
    var season = reqBody.result.parameters['NBA_Season']
    var pid = stats.getID(nbaName)
    nba.stats.playerCareerStats({PerMode:'Totals',PlayerID:pid})
             .then(result => stats.genTS(nbaName,season,result))
             .then(response => {
                 res.json({
                     speech:response,
                     displayText:response,
                     source:'stats.nba.com'
                 })
             })
}

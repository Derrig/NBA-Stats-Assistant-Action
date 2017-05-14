/**
 * stats.js generates the proper string response from the recieved data.
 * It makes no web calls.
 */

const fs = require('fs')
const lev = require('fast-levenshtein')
const moment = require('moment')

const constants = require('./constants.js')

const players = JSON.parse(fs.readFileSync('data/jsonplayerdict'))
const playerKeys = Object.keys(players)

function getSingleGame(hTeamId,homeScore,vTeamId,visitScore,statusNum,startTimeUTC){
    var homeTeam = constants.teamIDMap.get(hTeamId)
    var visitTeam = constants.teamIDMap.get(vTeamId)
    var startTime = moment(startTimeUTC)
    if(statusNum === 1){ //game has not started
        return 'The ' + visitTeam + ' are playing the ' + homeTeam + ' at '
                + startTime.format("h:mm a") + ' Eastern Standard Time.'
    }
    else if(statusNum === 2){ //game in progress
        if(parseInt(homeScore) > parseInt(visitScore)){
            return 'The ' + homeTeam + ' are leading the ' + visitTeam + ", "
                    + homeScore + '-' + visitScore + '.'
        }
        else if(parseInt(homeScore) < parseInt(visitScore)){
            return 'The ' + visitTeam + ' are leading the ' + homeTeam + ", "
                    + visitScore + '-' + homeScore + '.'
        }
        else{
            return 'The ' + visitTeam + ' are tied with the ' + homeTeam + ", "
                    + visitScore + '-' + homeScore + '.'
        }
    }
    else if(statusNum === 3){ //game is over
        if(parseInt(homeScore) > parseInt(visitScore)){
            return 'The ' + homeTeam + ' beat the ' + visitTeam + ", "
                    + homeScore + '-' + visitScore + '.'
        }
        else{
            return 'The ' + visitTeam + ' beat the ' + homeTeam + ", "
                    + visitScore + '-' + homeScore + '.'
        }
    }
}

exports.genGames = function(res){
    if(res.numGames == 0){
        return "There are no games scheduled for this day."
    }
    //loop through all games
    var output = []
    for(var i=0;i<res['games'].length;i++){
        var game = res['games'][i]
        var statusNum = game['statusNum']
        var startTimeUTC = game['startTimeUTC']
        var homeScore = game['hTeam']['score']
        var visitScore = game['vTeam']['score']
        var homeTeamId = parseInt(game['hTeam']['teamId'])
        var visitTeamId = parseInt(game['vTeam']['teamId'])
        output[i] = getSingleGame(homeTeamId,homeScore,visitTeamId,
                                    visitScore,statusNum,startTimeUTC)
        console.log(output[i])
    }
    return output.join(' ')
}

//this is no longer really needed...
exports.fuzzyMatch = function(player,arr){
    var leastPlayer = arr[0]
    var least = lev.get(player,arr[0])
    for (var i = 1; i < arr.length; i++){
        var distance = lev.get(player,arr[i])
        if(distance<least){
            var leastPlayer = arr[i]
            var least = distance
        }
    }
    return leastPlayer
}

exports.getID = function(playerStr){
    var fuzzyPlayer = this.fuzzyMatch(playerStr,playerKeys)
    console.log(players[fuzzyPlayer][0])
    return players[fuzzyPlayer][0]
}

function round(value, decimals) {
    //must do toFixed(1) e.g. 25.02 -> 25 instead of desired 25.0
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals).toFixed(1);
}

exports.genStatPerGame = function(stat,nbaName,playerCareerStats){
    var careerPerGame = playerCareerStats['CareerTotalsRegularSeason'][0]
    var nbaShorthand = constants.perGameDict[stat].nbaShorthand
    var statName = constants.perGameDict[stat].statName
    var num = careerPerGame[nbaShorthand]
    var response = nbaName + ' has a career average of ' +
                    num + ' ' + statName + ' per game.'
    return response
}

exports.rpg = function(nbaName,playerCareerStats){
    var careerPerGame = playerCareerStats['CareerTotalsRegularSeason'][0]
    var rebs = round(careerPerGame['reb'],1)
    var response = nbaName + ' has a career average of '
                   + rebs + ' rebounds per game.'

    return response
}

// exports.ts = function(player){
//     var regSeason = player['SeasonTotalsRegularSeason']
//     var curSeason = regSeason[regSeason.length-1]
//     var fga = curSeason['fga']
//     var fta = curSeason['fta']
//     var pts = curSeason['pts']
//     var ts = pts/(2*(fga+.44*fta))
//     return this.round(ts,3)
//     //console.log(this.round(ts,3))
// }

//nba.stats.playerCareerStats({PerMode:'PerGame',PlayerID:'252'})
//                                .then(ts)
//http://stats.nba.com/media/players/230x185/2546.png

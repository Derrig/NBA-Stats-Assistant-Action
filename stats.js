const nba = require('nba.js').default
const fs = require('fs')
const lev = require('fast-levenshtein')
const moment = require('moment')

const constants = require('./constants.js')

const players = JSON.parse(fs.readFileSync('./jsonplayerdict','utf8'))
const playerKeys = Object.keys(players)

function conError(res){
    return 'Sorry, I\'m having trouble connecting to stats.nba.com!'
}

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

function genGames(res){
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

exports.games = function(date){
    return nba.data.scoreboard({date:date}).then(genGames, conError)
}

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

exports.round = function(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

exports.ppg = function(player){
    var regSeason = player['SeasonTotalsRegularSeason']
    var maxPts = -1
    for(var i=0;i<regSeason.length;i++){
        if(regSeason[i]['pts']>maxPts){
            maxPts = regSeason[i]['pts']
        }
    }
    return(maxPts.toFixed(1))
    //console.log(regSeason[regSeason.length-1]['pts'])
}

exports.ts = function(player){
    var regSeason = player['SeasonTotalsRegularSeason']
    var curSeason = regSeason[regSeason.length-1]
    var fga = curSeason['fga']
    var fta = curSeason['fta']
    var pts = curSeason['pts']
    var ts = pts/(2*(fga+.44*fta))
    return this.round(ts,3)
    //console.log(this.round(ts,3))
}

exports.tester = function(pid){
    return nba.stats.playerCareerStats({PerMode:'PerGame',PlayerID:pid})
                                    .then(this.ppg)
}

//nba.stats.playerCareerStats({PerMode:'PerGame',PlayerID:'252'})
//                                .then(ts)
//http://stats.nba.com/media/players/230x185/2546.png

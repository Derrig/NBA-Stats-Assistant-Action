const nba = require('nba.js').default
const fs = require('fs')
const lev = require('fast-levenshtein')

const constants = require('./constants.js')

const players = JSON.parse(fs.readFileSync('./jsonplayerdict','utf8'))
const playerKeys = Object.keys(players)

function genGames(res){
    var res = res['games'][0]
    var homeTeam = constants.teamIDMap.get(parseInt(res['hTeam']['teamId']))
    var visitTeam = constants.teamIDMap.get(parseInt(res['vTeam']['teamId']))
    var homeScore = res['hTeam']['score']
    var visitScore = res['vTeam']['score']
    var startTime = res['startDateEastern']

    if(res['statusNum'] === 3){ //game over
        if(parseInt(homeScore) > parseInt(visitScore)){
            return 'The ' + homeTeam + ' beat the ' + visitTeam + ", "
                    + homeScore + '-' + visitScore + '.'
        }
        else{
            return 'The ' + visitTeam + ' beat the ' + homeTeam + ", "
                    + visitScore + '-' + homeScore + '.'
        }
    }
    else if(res['statusNum'] === 2){ //game in progress
        return 'to be implemented'
    }
    else if(res['statusNum'] === 1){ //game to start
        return 'to be implemented'
    }
}

exports.games = function(date){
    return nba.data.scoreboard({date:date}).then(genGames)
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
    for(i=0;i<regSeason.length;i++){
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

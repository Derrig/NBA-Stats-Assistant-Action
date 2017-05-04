const nba = require('nba.js').default
const fs = require('fs')
const lev = require('fast-levenshtein')

const players = JSON.parse(fs.readFileSync('./jsonplayerdict','utf8'))
const playerKeys = Object.keys(players)

exports.fuzzyMatch = function(player,arr){
    var leastPlayer = arr[0]
    var least = lev.get(player,arr[0])
    for (var i = 1; i < arr.length; i++){
        distance = lev.get(player,arr[i])
        if(distance<least){
            leastPlayer = arr[i]
            least = distance
        }
    }
    return leastPlayer
}

exports.getID = function(playerStr){
    var fuzzyPlayer = this.fuzzyMatch(playerStr,playerKeys)
    //console.log(fuzzyPlayer)
    return players[fuzzyPlayer][0]
}

exports.round = function(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

exports.ppg = function(player){
    var regSeason = player['SeasonTotalsRegularSeason']
    return(regSeason[regSeason.length-1]['pts'].toFixed(1))
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

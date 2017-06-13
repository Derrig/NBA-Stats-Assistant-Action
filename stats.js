/**
 * stats.js generates the proper string response from the recieved data.
 * It makes no web calls.
 */
const fs = require('fs')
const lev = require('fast-levenshtein')
const moment = require('moment')

const constants = require('./constants.js')
const misc = require('./misc.js')

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

exports.genGames = function(res,date){
    moment.updateLocale('en',constants.calendar)
    var date = moment(date)
    var toBe
    if(res.numGames == 0){
        toBe = ''
        if(date.isSameOrAfter(new Date(),'day')){
            toBe = 'are'
        }
        else{
            toBe = 'were'
        }
        return 'There '+ toBe +' no games scheduled '
                + misc.firstToLower(date.calendar()) + '.'
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
    output[0] = date.calendar() + ', '
                + misc.firstToLower(output[0])
    return output.join(' ')
}

// //this is no longer really needed...
// exports.fuzzyMatch = function(player,arr){
//     var leastPlayer = arr[0]
//     var least = lev.get(player,arr[0])
//     for (var i = 1; i < arr.length; i++){
//         var distance = lev.get(player,arr[i])
//         if(distance<least){
//             var leastPlayer = arr[i]
//             var least = distance
//         }
//     }
//     return leastPlayer
// }

exports.getID = function(playerStr){
    // var fuzzyPlayer = this.fuzzyMatch(playerStr,playerKeys)
    // console.log(players[fuzzyPlayer][0])
    // return players[fuzzyPlayer][0]
    console.log(players[playerStr][0])
    return players[playerStr][0]
}

function round(value, decimals) {
    //must do toFixed(decimals) e.g. 25.02 -> 25 instead of desired 25.0
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals).toFixed(decimals);
}

exports.genStatsPerGame = function(nbaName,season,stat,playerCareerStats){
    if(season === ''){
        if(stat === ''){ //return player's career stat summary
            return genPlayerSummary(nbaName,'',playerCareerStats)
        }
        else{ //return player's specific career stat average
            return genStatPerGame(nbaName,'',stat,playerCareerStats)
        }
    }
    else{ //specified season
        if(stat === ''){ //return player summary during specified season
            return genPlayerSummary(nbaName,season,playerCareerStats)
        }
        else{//return player's specified stat during specified season
            return genStatPerGame(nbaName,season,stat,playerCareerStats)
        }
    }
}

function getYearStats(season,playerCareerStats){
    var playerSeasonTotalsList = playerCareerStats['SeasonTotalsRegularSeason']
    for(i=0;i<playerSeasonTotalsList.length;i++){
        if(season === playerSeasonTotalsList[i]['season_id']){
            return playerSeasonTotalsList[i]
        }
    }
    return null //player did not play this year
}

function genStatPerGame(nbaName,season,stat,playerCareerStats){
    var totals //holds the desired statistics (either career or certain year)
    if(season === ''){  //want career stats
        totals = playerCareerStats['CareerTotalsRegularSeason'][0]
    }
    else{
        totals = getYearStats(season,playerCareerStats)
        if(totals === null){//player did not play during desired season
            return nbaName + ' did not play in the ' + season + ' NBA season.'
        }
    }
    var nbaShorthand = constants.perGameDict[stat].nbaShorthand
    var statName = constants.perGameDict[stat].statName
    var num = totals[nbaShorthand]
    if(num === null){ //likely means that stat was not recorded yet.
        return 'Sorry, ' //+statName.charAt(0).toUpperCase() + statName.slice(1)
                + statName
                + ' were not recorded before '
                + constants.firstRecorded[nbaShorthand] + '.'
    }
    var gamesPlayed = totals['gp']
    num = round(num/gamesPlayed,1)
    var response
    if(season === ''){
        response = nbaName + ' has a career average of ' +
                        num + ' ' + statName + ' per game.'
    }
    else{
        response = 'In ' + season + ', ' + nbaName + ' averaged ' + num +
                        ' ' + statName + ' per game.'
    }

    return response
}

function genPlayerSummary(nbaName,season,playerCareerStats){
    var totals
    if(season === ''){
        totals = playerCareerStats['CareerTotalsRegularSeason'][0]
        console.log(totals)
    }
    else{
        totals = getYearStats(season,playerCareerStats)
        if(totals === null){//player did not play during desired season
            return nbaName + ' did not play in the ' + season + ' NBA season.'
        }
    }
    var gamesPlayed = totals['gp']
    var ppg = round(totals['pts']/gamesPlayed,1)
    var apg = round(totals['ast']/gamesPlayed,1)
    var rpg = round(totals['reb']/gamesPlayed,1)
    var before1973 = false      //blocks&steals not recorded before 1973
    if(totals['stl']===null){
        before1973 = true
    }
    var spg = round(totals['stl']/gamesPlayed,1)
    var bpg = round(totals['blk']/gamesPlayed,1)
    var fg_pct = round(totals['fg_pct']*100,0)
    var fg3_pct = round(totals['fg3_pct']*100,0)
    var ft_pct = round(totals['ft_pct']*100,0)
    var response
    if(season === ''){
        response = nbaName + ' has a career average of ' + ppg + ' points, '
    }
    else{
        response = 'In the ' + season + ' NBA season, ' + nbaName
                        + ' averaged '+ ppg + ' points, '
    }
    if(parseInt(apg)>parseInt(rpg)){
        response += apg + ' assists, and ' + rpg + ' rebounds ' + 'per game '
    }
    else{
        response += rpg + ' rebounds, and ' + apg + ' assists ' + 'per game '
    }
    response += 'on ' + fg_pct+'/'+fg3_pct+'/'+ft_pct+ ' shooting'
    if(before1973){
        response += '.'
    }
    else{
        response += ', with ' + spg + ' steals and ' + bpg + ' blocks per game.'
    }
    return response
}

function getTSVal(playerCareerStats){
    var careerTotals = playerCareerStats['CareerTotalsRegularSeason'][0]
    var fga = careerTotals['fga']
    var fta = careerTotals['fta']
    var pts = careerTotals['pts']
    var ts = pts/(2*(fga+.44*fta))
    return round(ts*100,1) //convert .52321... to 52.3...
}

exports.genTS = function(nbaName,playerCareerStats){
    var ts = getTSVal(playerCareerStats)
    return nbaName + ' has a career true shooting percentage of ' + ts + '%.'
    //console.log(this.round(ts,3))
}

//nba.stats.playerCareerStats({PerMode:'PerGame',PlayerID:'252'})
//                                .then(ts)
//http://stats.nba.com/media/players/230x185/2546.png

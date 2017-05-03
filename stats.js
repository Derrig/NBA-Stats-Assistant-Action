const nba = require('nba.js').default;

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function ppg(player){
    var regSeason = player['SeasonTotalsRegularSeason']
    console.log(regSeason[regSeason.length-1]['pts'])
}

function ts(player){
    var regSeason = player['SeasonTotalsRegularSeason']
    var curSeason = regSeason[regSeason.length-1]
    var fga = curSeason['fga']
    var fta = curSeason['fta']
    var pts = curSeason['pts']
    var ts = pts/(2*(fga+.44*fta))
    console.log(round(ts,3))
}

nba.stats.playerCareerStats({PerMode:'PerGame',PlayerID:'2546'})
                                .then(ts)

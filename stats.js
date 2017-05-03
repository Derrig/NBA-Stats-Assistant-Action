const nba = require('nba.js').default;

function ppg(player){
    console.log(player['resultSets'][0]['rowSet'][26])
}

nba.stats.playerCareerStats({PerMode:'PerGame',PlayerID:'2546'})
                                .then(res => {ppg(res)});

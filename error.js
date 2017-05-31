/**
 * error.js contains error string response functions
 */

exports.conError = function(res){
    return 'Sorry, I\'m having trouble connecting to stats.nba.com!'
}

exports.scoresError = function(res){
    return 'Sorry, the data for this date is currently unavailable.'
}

/**
 * misc.js contains miscellaneous useful functions.
 */

exports.firstToUpper = function(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

exports.firstToLower = function(str){
    return str.charAt(0).toLowerCase() + str.slice(1)
}

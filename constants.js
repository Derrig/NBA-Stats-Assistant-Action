const hm = require('hashmap')

exports.teamIDMap = new hm.HashMap(1610612738, 'Celtics',
                                   1610612751, 'Nets',
                                   1610612752, 'Knicks',
                                   1610612755, 'Sixers',
                                   1610612761, 'Raptors',
                                   1610612741, 'Bulls',
                                   1610612739, 'Cavaliers',
                                   1610612765, 'Pistons',
                                   1610612754, 'Pacers',
                                   1610612749, 'Bucks',
                                   1610612737, 'Hawks',
                                   1610612766, 'Hornets',
                                   1610612748, 'Heat',
                                   1610612753, 'Magic',
                                   1610612764, 'Wizards',
                                   1610612743, 'Nuggets',
                                   1610612750, 'Timberwolves',
                                   1610612760, 'Thunder',
                                   1610612757, 'Trail Blazers',
                                   1610612762, 'Jazz',
                                   1610612744, 'Warriors',
                                   1610612746, 'Clippers',
                                   1610612747, 'Lakers',
                                   1610612756, 'Suns',
                                   1610612758, 'Kings',
                                   1610612742, 'Mavericks',
                                   1610612745, 'Rockets',
                                   1610612763, 'Grizzlies',
                                   1610612740, 'Pelicans',
                                   1610612759, 'Spurs')

//nbaShorthand is used to access the response json returned by stats.nba.com
exports.perGameDict = {ppg:{statName:'points',nbaShorthand:'pts'},
                       rpg:{statName:'rebounds',nbaShorthand:'reb'},
                       apg:{statName:'assists',nbaShorthand:'ast'},
                       spg:{statName:'steals',nbaShorthand:'stl'},
                       bpg:{statName:'blocks',nbaShorthand:'blk'},
                       tovpg:{statName:'turnovers',nbaShorthand:'tov'}}

exports.firstRecorded = {pts: 1946,reb:1950,ast:1946,stl:1973,blk:1973,tov:1977}

//locale formatting
exports.calendar = {calendar:{lastDay: '[Yesterday]',
                              sameDay: '[Today]',
                              nextDay: '[Tomorrow]',
                              lastWeek:'[Last] dddd',
                              nextWeek:'[On] dddd',
                              sameElse:'[On] MMMM Do'}}

from collections import OrderedDict
import json

def toDict(l):
    dictionary = {}
    for x in l:
        name = x[2]
        del x[2]
        dictionary[name] = x
    return dictionary

#input: the depickled player list
def toNameJson(l):
    dictJson = []
    for x in l:
        player = OrderedDict()
        player['value'] = x[2]
        player['synonyms'] = []
        dictJson.append(player)
    #return dictJson
    return json.dumps(dictJson)

def nbaSeasonJSON():
    dictJson = []
    i = 1946
    while i < 2017:
        season = OrderedDict()
        season['value'] = str(i) +'-'+ str(i+1)[-2:]
        synonyms = []
        synonyms.append(str(i+1))
        synonyms.append(str(i)+'-'+str(i+1))
        season['synonyms'] = synonyms
        dictJson.append(season)
        i += 1
    return json.dumps(dictJson)

#open('NBA_Name_Entity.json','w+').write(x)

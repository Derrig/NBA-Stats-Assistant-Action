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


#open('NBA_Name_Entity.json','w+').write(x)

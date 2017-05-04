def toDict(l):
    dictionary = {}
    for x in l:
        name = x[2]
        del x[2]
        dictionary[name] = x
    return dictionary

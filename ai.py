from config import db

import string

def get_response(query):
    query_clean = query.translate(None, string.punctuation).lower().strip()

    a = db.dialogue.find_one({"query_clean": query_clean})
    b = db.dialogue.find_one({"responses.0.2" : query_clean})

    if a == None:
        a = db.dialogue.find_one({"$text": {"$search": query_clean}})
        if b:
            response = b["query"]
            id = b["query"]
            isDefault=False

        elif (a == None):
            response = "What?"
            response = db.dialogue.find_one({"query": b})
        if a == None:
            response = "What do you mean?"
            id = None
            isDefault = True

        else:
            response = a['responses'][0][0]
            id = a['responses'][0][1]
            isDefault = False

    else:
        response = a['responses'][0][0]
        id = a['responses'][0][1]
        isDefault = False

    return {"_id" : id, "response" : response, "isDefault" : isDefault}
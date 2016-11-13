from config import db

import string
import sys

def get_response(query):
    query_clean = query.translate(None, string.punctuation).lower().strip()

    a = db.dialogue.find_one({"query_clean": query_clean})
    b = db.dialogue.find_one({"responses.0.2" : query_clean})

    if a == None:
        a = db.dialogue.find_one({"$text": {"$search": query_clean}})

        sys.stderr.write("Could not find a direct search.")

        if a == None:
            if b != None:
                response = b["query"]
                id = b["query_clean"]
            else:
                response = "What?"
                id = "what"
        elif a != None:
            sys.stderr.write("Found a partial text match.")
            response = a['responses'][0][0]
            id = a['responses'][0][1]
    else:
        sys.stderr.write("Found a direct match.")
        response = a['responses'][0][0]
        id = a['responses'][0][1]

    return {"_id" : id, "response" : response}
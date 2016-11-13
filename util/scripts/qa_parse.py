import re
import zipfile
from pymongo import MongoClient
import string

URI = "mongodb://admin:alanturing9448@ds151707.mlab.com:51707/passtheturing"

mc = MongoClient(URI)
db = mc.passtheturing


def parsePairs(file):
	results = []
	questions = []
	responses = []

	#qa pairs
	cleanStr = re.sub(r'\d+[\n\r]+\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d', ' ', file)
	results = re.findall(r'[\w][^!.<>?]*[?][^.!?<>]+[.!]', cleanStr, re.M)

	#split off questions, remove newlines, trailing dashes and whitespace
	results = [re.split(r'[?]', result, 1, re.M) for result in results]
	questions = [re.sub(r'[\s]+', ' ', question[0] + '?').lstrip() for question in results]
	questions = [re.findall(r'[\w][^!.<>?]*[?]', question, re.M)[0].lstrip() for question in questions]

	#find answers in latter half of split, remove newlines, trailing dashes and whitespace
	answers = [re.findall(r'[\w][^!.<>?]*[.!]', answer[1], re.M) for answer in results]
	answers = [re.sub(r'[\s]+', ' ', answer[0]).lstrip() for answer in answers]
	answers = [re.findall(r'[\w][^!.<>?]*[.!]', answer, re.M)[0].lstrip() for answer in answers]

	pairs = {}

	#fill dict
	for i in range(0, len(questions)):
		pairs[questions[i]] = answers[i]

	#print formatted pairs
	for pair in pairs:
		print(pair, pairs[pair])

		pair_clean = pair.translate(None, string.punctuation).lower().strip()

		check_existing = db.dialogue.find_one({"query_clean" : pair_clean, "query" : pair})

		if check_existing != None:
			update = True
			for response in check_existing['responses']:
				if clean_input(pairs[pair]) == response[2]:
					update = False
					print "NOT UPDATING THIS ONE"
			if update:
				db.dialogue.update({"query_clean" : pair_clean}, {"$push" : {"responses" : [pairs[pair], 0, clean_input(pairs[pair])]}})

		if "?" in pair:
			query_type = "question"
		else:
			query_type = "statement"

		db.dialogue.insert({"query" : pair,
							"query_type" : query_type,
							"query_clean" : clean_input(pair),
							"responses" : [[pairs[pair], 0, clean_input(pairs[pair]) ]] })

def parseZip(zipInput):
	with zipfile.ZipFile(zipInput,'r') as zip:
		parsePairs(zip.read(zip.infolist()[0]))

def parseTxt(txtInput):
	with open(txtInput) as fileStream:
		parsePairs(fileStream.read())

def clean_input(s):
	return s.translate(None, string.punctuation).lower().strip()

#testCase
# parseZip('C:/Users/Vincent/Desktop/Turing/passtheturing/util/scripts/subs/StarWars6.zip')
for i in range(20, 22):
	print("on movie script #" + str(i))
	parseTxt('subs/friends' + str(i) + '.txt')

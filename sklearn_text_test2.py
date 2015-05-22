from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB

import subprocess
import os.path

searches = []
targets = [] 

g = open("targets.txt", "r")
for r in g.readlines():
    targets = targets + [r.strip()]

print len(targets)
print targets

f = open("words.txt", "r")
searches = [] 
for r in f.readlines():
    searches = searches + [r.strip()]

print len(searches)
print searches

text_clf = Pipeline([('vect', CountVectorizer()),('tfidf', TfidfTransformer()),('clf', MultinomialNB()),])

#searches = ["heart", "lung", "kidney","brain", "cardiology", "pulmonology", "nephrology", "neurology", "anesthesiology", "carpal tunnel", "coronary artery", "fingernail"]
#targets = ["organ", "organ", "organ", "organ", "specialty", "specialty", "specialty", "specialty", "specialty", "bodypart", "bodypart", "bodypart"]
results = []

web = "uptodate"

text = ""


for s in searches:
	fname  = s + "_" + web + ".txt"
	if os.path.isfile(fname):
		f = open(fname, 'r')
		for r in f.readlines():
			text = text + r 
	else:
		f = open(fname, 'w')
		cmd = ['casperjs search_' + web + '.js \'' + s + '\''] #, 'args']
		text = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
		f.write(text)
	results =  results + [text]
	text=""


text_clf = text_clf.fit(results, targets)

new_search = "gastroenterology"

cmd = ['casperjs search_' + web + '.js \'' + new_search + '\'']
new  = [subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)]


predicted = text_clf.predict(new)

print new_search
print predicted[0]

answer = input('Is that right? "y"/"n"  ')

if answer == "y":
	print "you answered yes"
	searches = searches + [new_search]
	targets = targets + [predicted[0]]
	g = open("targets.txt", "w")
	g.write("\n".join(targets))

	f = open("words.txt", "w")
	f.write("\n".join(searches))

else:
	print "you ansered no"
	answer = input("what's the correct answer?  ")
	if answer == "bodypart" or answer == "organ" or answer == "specialty":
		searches = searches + [new_search]
		targets = targets + [answer]
		g = open("targets.txt", "w")
		g.write("\n".join(targets))

		f = open("words.txt", "w")
		f.write("\n".join(searches))
	else:
		print "you did not answer"
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB

import subprocess
import os.path





text_clf = Pipeline([('vect', CountVectorizer()),('tfidf', TfidfTransformer()),('clf', MultinomialNB()),])

searches = ["heart", "lung", "kidney","brain", "cardiology", "pulmonology", "nephrology", "neurology", "anesthesiology", "carpal tunnel", "coronary artery", "fingernail", "elbow", "shoulder", "knee", "ear", "mouth"]
targets = ["organ", "organ", "organ", "organ", "specialty", "specialty", "specialty", "specialty", "specialty", "bodypart", "bodypart", "bodypart", "bodypart", "bodypart", "bodypart", "bodypart", "bodypart"]
results = []

text = "" 




for s in searches:
	cmd = ['casperjs search_dictionary.js \'' + s + '\''] #, 'args']
	text = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
	results =  results + [text]
	fname  = s + ".txt"
	if os.path.isfile(fname):
		f = open(fname, 'r')
		for r in f.readlines():
			print r
	else:
		f = open(fname, 'w')
		f.write(text)


text_clf = text_clf.fit(results, targets)

cmd = ['casperjs search_dictionary.js \'' + "nose" + '\'']
new  = [subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)]

#X_new_counts = text_clf.transform(new)
#X_new_tfidf = text_clf.transform(X_new_counts)

predicted = text_clf.predict(new)

print new[0]
print predicted[0]


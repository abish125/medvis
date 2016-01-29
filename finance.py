# first find the program where you did it before

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import SGDClassifier
from os import listdir
from os.path import isfile, join
import string
import schedule
import time
import csv
from datetime import datetime,timedelta,date
import time
import os
import subprocess
import sys
 
current = time.strftime("%m-%d-%y")
#print current
b_d = datetime.strptime(current, "%m-%d-%y")- timedelta(days=1)
print b_d.strftime("%b %d, %Y")
 
#directory = "/Users/andrewbishara/Dropbox/ipyNotebook/finances"
#dates = next(os.walk('.'))[1]
 
targs_file = "targets.txt"
counter = 0

targets = []
news = []
text = ""
 
rows = []
with open('comp_symbols.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for row in spamreader:
        rows = rows + [row]
        
cmd = ['casperjs search_google_fin_get_current_articles.js \'' + rows[1][0] + '\' \'' + b_d.strftime("%b %d, %Y") + '\''] #, 'args']
guess = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)

print guess
#Now it's time to get all the news about one stock



#dates.remove('.ipynb_checkpoints')
#for d in dates:
#    print d



'''
    onlyfiles = [ f for f in listdir(d) if isfile(join(d,f)) ]
    if '.DS_Store' in onlyfiles:
        onlyfiles.remove('.DS_Store')
    day_after  = datetime.strptime(d,"%m-%d-%y")+timedelta(days=1)
    if day_after.strftime("%m-%d-%y") in dates:
        f = open(day_after.strftime("%m-%d-%y")+"/"+targs_file,"r")
        for r in f.readlines():
            targets = targets + [r]
            counter = counter + 1
        f.close()
        min_final = min(len(onlyfiles)-2, len(targets))
        if counter > min_final and min_final>140:
            counter = 140
        counter = min(counter,min_final)
        for r in rows[1:counter]:
            g = open(d+"/"+r[0] + "_google_fin.txt","r")
            #print r[0]
            #print rows.index(r)
            for s in g.readlines():
                text = text + s
            news = news + [text]
            text = ""
    #if counter != 0:
        #print counter
        #print d
        #print day_after
        #print "|||||||||||||"
    counter  = 0
 
print len(news)
print len(targets)
 
min_final = min(len(news), len(targets))
number_right = 0
number_wrong = 0
good_and_right = 0
good_and_wrong = 0
#do a loop where you run analysis and see if the computer gets smarter...
for c in range(min_final)[2100:min_final-1]:
    text_clf = Pipeline([('vect', CountVectorizer()),('tfidf', TfidfTransformer()),('clf', SGDClassifier(loss='hinge', penalty='l2' ,alpha=1e-3, n_iter=5)),])
    text_clf = text_clf.fit(news[:c], targets[:c])
    d = text_clf.decision_function([news[c+1]])
    p = text_clf.predict([news[c+1]])
    print d
    e = d[0][-1]
    print e
    if e > 1.3:
        if p == targets[c+1]:
            number_right = number_right + 1
            print "right"
        else:
            number_wrong = number_wrong + 1
            print "wrong"
        if ['good\n'] == p and p == targets[c+1]:
            good_and_right = good_and_right + 1
        elif ['good\n'] == p and p != targets[c+1]:
            good_and_wrong = good_and_wrong + 1
        print p
        print targets[c+1]
        print e
        print news[c+1]
        print "|||||||||"
print number_right
print number_wrong
print float(number_right)/float(number_right+number_wrong)
print good_and_right
print good_and_wrong
print float(good_and_right)/float(good_and_right+good_and_wrong)

#from the analysis file from the finance code

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import SGDClassifier
import string
import schedule
import time
import csv
from datetime import datetime,timedelta
import time
import os
import subprocess
import sys
 
#get current date
current = time.strftime("%m-%d-%y")
#set it to the directory name
#path = current
path = "08-30-15"
 
rows = []
with open('comp_symbols.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for row in spamreader:
        rows = rows + [row]
 
results = []
counter = 0
text = ""
 
print os.path.abspath(os.curdir)
 
g = open(path+ '/error.txt','a').close()
g = open(path+ '/targets.txt','a').close()
 
try: 
    for s in rows[1:]:
        fname  = path+ "/" + s[0] + "_google_fin" + ".txt"
        if os.path.isfile(fname):
            f = open(fname, "r")
            for r in f.readlines():
                text = text + r 
            f.close()
            results = results + [text]
        print counter
        counter = counter + 1
except:
    e = sys.exc_info()[0]
    g = open(path+ "/error.txt", "w")
    g.write(e)
    print e.output
    g.close()
 
targets=[]
targs_file = path+ "/targets.txt"
if os.path.isfile(targs_file):
    f = open(targs_file, "r")
    for r in f.readlines():
        targets = targets + [r.strip()]
    f.close()
 
print targets
 
text_clf = Pipeline([('vect', CountVectorizer()),('tfidf', TfidfTransformer()),('clf', SGDClassifier(loss='hinge', penalty='l2' ,alpha=1e-3, n_iter=5)),])
 
text_clf = text_clf.fit(results[:len(targets)], targets)
 
num=141
 
guess = ""
cmd = ['casperjs search_google_fin_text.js \'' + rows[num][0] + '\''] #, 'args']
guess = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
 
print text_clf.predict([guess.decode(encoding='UTF-8',errors='strict')])
print text_clf.decision_function([guess.decode(encoding='UTF-8',errors='strict')])
 
print rows[num][0]
 
cmd = ['casperjs search_google_fin_return.js \'' + rows[num][0] + '\''] #, 'args']
text = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
diff = float(text.split("\n")[0])-float(text.split("\n")[2])
answer = ""
if diff > 0:
    answer = "good"
else: 
    answer = "bad"
print answer
return HttpResponse(answer)

'''
import requests
from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import requires_csrf_token, ensure_csrf_cookie
from django.core.context_processors import csrf
from django.http import HttpResponse
import os
from hello.models import Body_Point, Organ, Specialty
import string
import re
from nltk import *
import json
import csv
from django.http import JsonResponse
from django.forms.models import model_to_dict
import subprocess
from classify_class import Classifier
from datetime import datetime,timedelta
import time


# Create your views here.
def index(request):
	#c = Classifier("med_targets.txt", "med_words.txt","wikipedia", "med_conf.txt", ["yes","no"])
	#c.already_started()
	return render(request, 'organs/test_manager_class2.html')

def send_data(request):
	d = Body_Point.objects.all()
	#data = [ob.as_json() for ob in d]
	data = []
	for a in d:
		data = data + [model_to_dict(a)]
	return HttpResponse(json.dumps(data))

def send_sp(request):
	d = Specialty.objects.all()
	data = []
	for a in d:
		data = data + [model_to_dict(a)]
	return HttpResponse(json.dumps(data))

def send_orgs(request):
	d = Organ.objects.all()
	data = []
	for a in d:
		data = data + [model_to_dict(a)]
	return HttpResponse(json.dumps(data))

def save(request):
	c = {}
	c.update(csrf(request))
	if request.POST:
		id = request.POST['id']
		name = request.POST['name']
		snomedct_code = request.POST['snomed']
		cp_x = request.POST['x']
		cp_y = request.POST['y']
		cp_z = request.POST['z']
		#sp = request.POST['sp']
		#org = request.POST['or']
		bp = Body_Point(int(id), name, snomedct_code, float(cp_x), float(cp_y), float(cp_z))
    	bp.save()
		#fd = open(os.getcwd() + '/gettingstarted/media/body_part.csv', 'a')
		#print [id, name, snomedct_code, cp_x, cp_y, cp_z];
		#fd.write("\n" + id+","+name+","+"Hello"+","+cp_x+","+cp_y+","+cp_z)
		#fd.close()
		#print "hello"
	return render(request, 'test_post.html', c)

def add_relation(request):
	c = {}
	c.update(csrf(request))
	if request.POST:
		item_types = request.POST['items'].split(",")
		if len(item_types) == 2:
			if item_types[0] == "p":
				bp = Body_Point.objects.filter(id=int(request.POST["p_id"]))[0]
				if item_types[1] == "sp":
					spec = Specialty.objects.filter(id=int(request.POST["sp_id"]))[0]
					bp.specialties.add(spec)
				else:
					organ = Organ.objects.filter(id=int(request.POST["or_id"]))[0]
					bp.organs.add(organ)
			elif item_types[0] == "or":
				organ = Organ.objects.filter(id=int(request.POST["or_id"]))[0]			
				spec = Specialty.objects.filter(id=int(request.POST["sp_id"]))[0]
				spec.organs.add(organ)
		else:
			bp = Body_Point.objects.filter(id=int(request.POST["p_id"]))[0]
			organ = Organ.objects.filter(id=int(request.POST["or_id"]))[0]
			spec = Specialty.objects.filter(id=int(request.POST["sp_id"]))[0]
			bp.specialties.add(spec)
			bp.organs.add(organ)
			spec.organs.add(organ)
	return HttpResponse("success")

def remove_relation(request):
	c = {}
	c.update(csrf(request))
	if request.POST:
		item_types = request.POST['items'].split(",")
		if len(item_types) == 2:
			if item_types[0] == "p":
				bp = Body_Point.objects.filter(id=int(request.POST["p_id"]))[0]
				if item_types[1] == "sp":
					spec = Specialty.objects.filter(id=int(request.POST["sp_id"]))[0]
					bp.specialties.remove(spec)
				else:
					organ = Organ.objects.filter(id=int(request.POST["or_id"]))[0]
					bp.organs.remove(organ)
			elif item_types[0] == "or":
				organ = Organ.objects.filter(id=int(request.POST["or_id"]))[0]			
				spec = Specialty.objects.filter(id=int(request.POST["sp_id"]))[0]
				spec.organs.remove(organ)
		else:
			bp = Body_Point.objects.filter(id=int(request.POST["p_id"]))[0]
			organ = Organ.objects.filter(id=int(request.POST["or_id"]))[0]
			spec = Specialty.objects.filter(id=int(request.POST["sp_id"]))[0]
			bp.specialties.remove(spec)
			bp.organs.remove(organ)
			spec.organs.remove(organ)
	return HttpResponse("success")

def delete(request):
	c = {}
	c.update(csrf(request))
	if request.POST:
		id = request.POST['id']
	bp = Body_Point.objects.filter(id=int(id))
	bp.delete()
	return HttpResponse("hello")

def search(request):
	c = {}
	c.update(csrf(request))
	search = ""
	results = ""
	if request.POST:
		search = request.POST["search_box"]
		cmd = ['casperjs search_uptodate.js \'' + search + '\''] #, 'args']
		results = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
	else:
		results = "error"
	return HttpResponse(results)

def guess(request):
	import string
	c = {}
	c.update(csrf(request))
	guess_words = ""
	results = ""
	if request.POST:
		guess_words = request.POST["words"]#.decode('utf-8', 'ignore')
		guess_words = guess_words.split(" ")
		gw_cleaned = []
		for gw in guess_words:
			gw = ''.join(e for e in gw if e.isalnum())
			if gw != "":
				gw_cleaned = gw_cleaned + [''.join(e for e in gw if e.isalnum())]
		c = Classifier("med_targets.txt", "med_words.txt","wikipedia", "med_conf.txt", ["yes","no"])
		c.already_started()
		print gw_cleaned
		for w in gw_cleaned:
			results = results + " " + c.classify(w)
	else:
		results = "error"
	return HttpResponse(results)

def teach(request):
	c = {}
	c.update(csrf(request))
	teach_words = ""
	teach_targets = ""
	results=""
	if request.POST:
		teach_words = request.POST["teach_words"]
		teach_words = teach_words.split(" ")
		teach_targets = request.POST["teach_targets"]
		teach_targets = teach_targets.split(" ")[1:]
		print teach_targets
		c = Classifier("med_targets.txt", "med_words.txt","wikipedia", "med_conf.txt", ["yes","no"])
		c.already_started()
		c.change_terms(teach_words, teach_targets)
	else:
		results = "error"
	return HttpResponse("success")

def add_items(request):
	c = {}
	c.update(csrf(request))
	if request.POST:
		spec = request.POST["specialties"]
		organs = request.POST["organs"]
		body_points = request.POST["body_points"]
		if spec:
			new_id = len(Specialty.objects.all())+1
			bp = Specialty(new_id,spec)
			#bp.save()
			print spec
		if organs:
			print organs
		if body_points:
			print body_points
	return HttpResponse("success")

def find_snomed(request):
	c = {}
	c.update(csrf(request))
	search = ""
	results = ""
	if request.POST:
		search = request.POST["name"]
		cmd = ['casperjs snomed_scrape.js \'' + search + '\''] #, 'args']
		results = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
		results_list = results.split(" ")
		results = results_list[1]
	else:
		results = "error"

    #subprocess.call(['cd', '/app/hellodjango'],
            #shell=True,
            #stderr=subprocess.STDOUT)
    #cmd = ['cd', 'casperjs']
    #cmd = ['ln', '-sf', '`pwd`/bin/casperjs', '../venv/bin']
	return HttpResponse(results)

def get_object_from_name(word):
	for s in Specialty.objects.all():
		if word == s.name:
			return s
	for o in Organ.objects.all():
		if word == o.name:
			return o
	for bp in Body_Point.objects.all():
		if word == bp.name:
			return bp
	for f in Finding.objects.all():
		if word == f.name:
			return f
	for c in Condition.objects.all():
		if word == c.name:
			return c
	return False


def db(request):

    body_point = Body_Point()
    body_point.save()

    body_points = Body_Point.objects.all()

    return render(request, 'db.html', {'body_points': body_points})

def planning(request):
	return render(request, 'organs/planning.html')

def tasks(request):
	c = {}
	timeAvail= ""
	placeAt= ""
	results = ""
	cmd = ""
	c.update(csrf(request))
	if request.POST:
		timeAvail = request.POST["time"]
		placeAt = request.POST["place"]
		cmd = ['casperjs get_note_from_evernote.js'] #, 'args']
		results = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
		tasks = []
		dailys = []
		dates = []
		times = [] 
		places = []
		items = []
		rows = results.split("\n")
		for r in rows:
			if r != "":
				items = r.split(",")
				tasks = tasks + [items[0]]
				if items[3] != "daily": 
					dates = dates + [datetime.strptime(items[3], "%m/%d/%y")]
				else:
					dailys = dailys + [items[0]]
					dates = dates + [items[3]]				
				times = times + [items[1]]
				places = places + [items[2]]
		current = time.strftime("%m/%d/%y")
		print current
		b_d = datetime.strptime(current, "%m/%d/%y")
		print b_d
		def func(x):
			if x == "daily":
				delta = b_d-b_d
			else:
				d =  datetime.strptime(x.strftime("%m/%d/%y"), "%m/%d/%y")
				delta =  d - b_d
			return delta.days
		lis2 = dates
		
		score = []
		for c in range(len(tasks)):
			timeS=0
			placeS=0
			dateS=0
			if places[c].find(placeAt) != -1:
				placeS = 5
			else:
				placeS = 0
			if int(timeAvail) > int(times[c]):
				timeS=2
			elif int(timeAvail) == int(times[c]):
				timeS=3
			else:
				timeS = 1
			deltD = func(dates[c])
			if deltD <=5:
				f = [0,1,2,3,4,5]
				h = list(reversed(f))
				dateS = h[f.index(deltD)]
				if dateS == 0:
					dateS=1
			score = score + [timeS*placeS*dateS]
			#print tasks[c]
			#print score[c]
			#print "place" + str(placeS)
			#print "time" + str(timeS)
			#print "date" + str(dateS)
		highestS = max(score)
		bestTasks = ""
		for c in range(len(score)):
			if (highestS-10) <= score[c]:
				if dates[c] == "daily":
					dates[c] = datetime.strptime(time.strftime("%m/%d/%y"), "%m/%d/%y")
				bestTasks = bestTasks + tasks[c] + "," + times[c] + "," + places[c] + "," + dates[c].strftime('%m/%d/%Y') + "," + str(score[c]) + "\n"
	else:
		results = "error"
	return HttpResponse(bestTasks)


def finances(request):
	return render(request, 'organs/finances.html')
	
def finance2(request):
	c = {}
	timeAvail= ""
	placeAt= ""
	results = ""
	cmd = ""
	c.update(csrf(request))
	if request.POST:
		timeAvail = request.POST["time"]
		placeAt = request.POST["place"]
		cmd = ['casperjs get_note_from_evernote.js'] #, 'args']
		results = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
		tasks = []
		dailys = []
		dates = []
		times = [] 
		places = []
		items = []
	
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
	#print b_d.strftime("%m-%d-%y")
	 
	directory = "/Users/andrewbishara/Dropbox/ipyNotebook/finances"
	dates = next(os.walk('.'))[1]
	 
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
	 
	dates.remove('.ipynb_checkpoints')
	for d in dates:
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

def ekg(request):
	
	'''from PIL import Image
	im = Image.open('ekg.jpg')
	
	pixels = list(im.getdata())
	width, height = im.size
	pixels = [pixels[i * width:(i + 1) * width] for i in xrange(height)]
	
	print pixels'''
	import numpy as np
	#import matplotlib.pyplot as plt
	#from skimage.data import camera
	from skimage.filters import roberts, sobel, scharr, prewitt
	from scipy import misc
	import skimage.io as io
	#from PIL import Image
	#im = Image.open("ekg12.gif")
	from PIL import Image
	img = Image.open('gettingstarted/media/ekg12.gif').convert('LA')
	img.save('greyscale.gif')
	#img.show()
	#image = im.convert('L')   # 'L' stands for 'luminosity'
	#im = np.asarray(gray) #Can be many different formats.
	img = Image.open("greyscale.gif")
	pix = img.load()
	#print im.size #Get the width and hight of the image for iterating over
	#print pix[0,0] #Get the RGBA Value of the a pixel of an image
	#pix[0,0] = value
	
	groups_of_rows = []
	row = []
	previous = 0
	pixels =[]
	
	#pix_val_flat = [x for sets in pix for x in sets]
	#print pix_val_flat
	for i in range(img.size[0]):
		for j in range(img.size[1]):
			if pix[i,j]< 100:
				if previous == i:
					pix[i,j] = 255
				else:
					pix[i,j]=0
					pixels = pixels + [img.size[1]-j]
				previous = i
			else:
				pix[i,j] = 255
	img.save('gettingstarted/media/ekg13.gif')
	'''
	for g in groups_of_rows:
		for r in range(len(g)):
			if r!= len(g)-1:
				pix[g]
	'''
	return render(request, 'organs/ekg.html',{'pixels':pixels})
	
def ekg2(request):
	
	'''from PIL import Image
	im = Image.open('ekg.jpg')
	
	pixels = list(im.getdata())
	width, height = im.size
	pixels = [pixels[i * width:(i + 1) * width] for i in xrange(height)]
	
	print pixels'''
	import numpy as np
	#import matplotlib.pyplot as plt
	#from skimage.data import camera
	from skimage.filters import roberts, sobel, scharr, prewitt
	from scipy import misc
	import skimage.io as io
	#from PIL import Image
	#im = Image.open("ekg12.gif")
	from PIL import Image
	img = Image.open('gettingstarted/media/ekg12.gif').convert('LA')
	img.save('greyscale.gif')
	#img.show()
	#image = im.convert('L')   # 'L' stands for 'luminosity'
	#im = np.asarray(gray) #Can be many different formats.
	img = Image.open("greyscale.gif")
	pix = img.load()
	#print im.size #Get the width and hight of the image for iterating over
	#print pix[0,0] #Get the RGBA Value of the a pixel of an image
	#pix[0,0] = value
	
	groups_of_rows = []
	row = []
	previous = 0
	pixels =[]
	
	#pix_val_flat = [x for sets in pix for x in sets]
	#print pix_val_flat
	for i in range(img.size[0]):
		for j in range(img.size[1]):
			if pix[i,j]< 100:
				if previous == i:
					pix[i,j] = 255
				else:
					pix[i,j]=0
					pixels = pixels + [img.size[1]-j]
				previous = i
			else:
				pix[i,j] = 255
	img.save('gettingstarted/media/ekg13.gif')
	'''
	for g in groups_of_rows:
		for r in range(len(g)):
			if r!= len(g)-1:
				pix[g]
	'''
	print len(pixels)
	print img.size[0]
	print img.size[1]
	return render(request, 'organs/ekg2.html',{'pixels':pixels})
	
def training(request):
	return render(request, 'organs/training.html')

def train(request):
	c = {}
	target = ""
	cmd = ""
	c.update(csrf(request))
	if request.POST:
		target = request.POST["target"]
	return HttpResponse(target)
	
def s(request):
	c = {}
	target = ""
	cmd = ""
	current = 0
	last = 0
	n=""
	x=""
	y=""
	z=""
	s=""
	names = []
	xs = []
	ys = []
	zs = []
	selected = []
	organ_name = ""
	c.update(csrf(request))
	if request.POST:
		n = request.POST["names"]
		x = request.POST["xs"]
		y = request.POST["ys"]
		z = request.POST["zs"]
		s = request.POST["selected"]
		organ_name = request.POST["organ_name"]
		names = n.split("|")
		xs = x.split("|")
		ys = y.split("|")
		zs = z.split("|")
		selected = s.split("|")
		print "hello"
		for i in range(len(names)):
			id = len(Body_Point.objects.all())+1;
			name = names[i]
			cp_x = xs[i]
			cp_y = ys[i]
			cp_z = zs[i] 
			org_name = organ_name
			select = selected[i]
			bp = Body_Point(id, name, float(cp_x), float(cp_y), float(cp_z), org_name,select)
	    	bp.save()
	return HttpResponse(target)
	
def create_organ(request):
	return render(request, 'organs/create_organ.html')
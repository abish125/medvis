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


# Create your views here.
def index(request):
	#c = Classifier("med_targets.txt", "med_words.txt","wikipedia", "med_conf.txt", ["yes","no"])
	#c.already_started()
	return render(request, 'organs/test_manager_class1.html')

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


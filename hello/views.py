import requests
from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import requires_csrf_token, ensure_csrf_cookie
from django.core.context_processors import csrf
from django.http import HttpResponse
import os
#from .models import Greeting
import string
import re
from nltk import *
import json
import csv


# Create your views here.
def index(request):	
	c = {}
	c.update(csrf(request))
	#assert False, "hello"
	if request.POST:
		name = request.POST['name']
		age = request.POST['age']
	return render(request, 'organs/test_plot_class2.html',c)

def save(request):
	c = {}
	c.update(csrf(request))
	if request.POST:
		id = request.POST['id']
		name = request.POST['name']
		snomedct_code = ""
		cp_x = request.POST['x']
		cp_y = request.POST['y']
		cp_z = request.POST['z']
		fd = open(os.getcwd() + '/gettingstarted/media/body_part.csv', 'a')
		print [id, name, snomedct_code, cp_x, cp_y, cp_z];
		fd.write("\n" + id+","+name+","+"Hello"+","+cp_x+","+cp_y+","+cp_z)
		fd.close()
		print "hello"
	return render(request, 'test_post.html', c)

def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})


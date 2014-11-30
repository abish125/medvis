import requests
from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import requires_csrf_token, ensure_csrf_cookie
from django.core.context_processors import csrf
from django.http import HttpResponse
import os
from .models import Greeting
import string
import re
from nltk import *
import json

# Create your views here.
def index(request):	
	c = {}
	c.update(csrf(request))
	#assert False, "hello"
	print "hello"
	if request.POST:
		ame = request.POST['name']
		age = request.POST['age']
	#print name
	return render(request, 'organs/test_plot_class2.html',c)

def save(request):
	c = {}
	c.update(csrf(request))
	#assert False, c
	if request.POST:
		name = request.POST['name']
		age = request.POST['age']
	print name
	print age
	return render(request, 'test_post.html', c)

def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})


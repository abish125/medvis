import requests
from django.shortcuts import render
from django.http import HttpResponse
import os
from .models import Greeting
import string
import re
from nltk import *
import json

# Create your views here.
def index(request):
	return render(request, 'organs/organize_data.html')


def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})

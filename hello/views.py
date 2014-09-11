import requests
from django.shortcuts import render
from django.http import HttpResponse
import os
from .models import Greeting
import string
import re
from nltk import *
from pymedtermino.snomedct import *
import json

# Create your views here.
def index(request):
	g= open("case1.txt","r")
	x= g.readlines()

	h = open("most_common_english_words.txt", "r")
	z = h.readlines()

	y=""
	words_in_order = []
	common_english_words = []

	full_text = ""

	for n in x:
	    y = y + ' ' + n.split(string.punctuation)[0]
	    full_text = full_text + n
	    
	words_in_order = y.split()
	    
	y = ""
	for n in z:
	    y = y + ' ' + n.split('\r\n')[0]
	    
	common_english_words = y.split()

	less_common_words_in_order = []

	found=False

	for word in words_in_order:
	    for c_word in common_english_words:
	        if word.strip(string.punctuation).strip().lower() == c_word.strip().lower():
	            found = True
	    if not found:
	        less_common_words_in_order = less_common_words_in_order + re.findall(r"[\w']+|[.,!?;\/\\]", word)
	    found = False

	medical_words = []
	cards_concepts = []
	concepts = []

	for word in less_common_words_in_order[:500]:
	    try:
	        concepts = SNOMEDCT.search(word.strip(string.punctuation))
	        if len(concepts) != 0 and len(word) > 2 and len(re.findall(r'\d+', word)) == 0:
	            medical_words = medical_words + [word.strip(string.punctuation)]
	    except:
	        continue

	found = False

	category = SNOMEDCT[56265001]

	cards_concepts = []

	for mw2 in medical_words:
	    for mw in re.findall(r"[\w']+|[.,!?;\/\\]", mw2):
	        concepts = SNOMEDCT.search(mw.strip(string.punctuation))
	        for concept in concepts:
	            #if concept.is_in_core:
	                #print concept.terms
	            if category in concept.parents and not found:
	                cards_concepts = cards_concepts + [mw]
	                found = True
	                break
	            else: 
	                for p in concept.parents:
	                    if category in p.parents and not found:
	                        cards_concepts = cards_concepts + [mw]
	                        found = True
	                        break
	            if found:
	                break
	        found = False

	counter = 0
	terms_in_search = []
	words_nearby_concept = []

	correct_cards = []

	found = False
	for cc in cards_concepts:
	    for t in SNOMEDCT.search(cc+"*"):
	        for terms in t.terms:
	            if full_text[i-30:i+30].find(terms) != -1 and not found:
	                correct_cards = correct_cards + [terms]
	                print full_text[i-30:i+30]
	                found = True
	    for i in [m.start() for m in re.finditer(cc, full_text)]:
	        words_nearby_concept= words_nearby_concept +[full_text[i-40:i+50]]
	    counter=counter + 1 
	    found = False

	high = Queue('high', connection=conn)
	search_term =[post_text]

	job = high.enqueue_call(func=getScore,args=(search_term), timeout=600)
	
	return render(request, 'convert_text2.html', {'text':newboth, 'link': results, 'job': job.id})

	#output = json.dumps(correct_cards)
    
	#return render(request, 'organs/organs.html', output)

def organs2(request):
	job= Job.fetch(job_id, connection=conn)
	return render(request, 'convert_text3.html', {'results': job.result})


def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})


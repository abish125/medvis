import requests
import re
import urllib2
import subprocess
import os

from nltk import *
import nltk

import csv
import time

import mechanize
import cookielib
from django.utils.encoding import smart_str, smart_unicode

#from rq import Queue
#from worker import conn

def getScore(search_term):
    search = ""
    for s in search_term:
        search = search + smart_str(s)
    cmd = ['casperjs add_article.js \'' + search + '\''] #, 'args']

    #subprocess.call(['cd', '/app/hellodjango'],
            #shell=True,
            #stderr=subprocess.STDOUT)
    #cmd = ['cd', 'casperjs']
    #cmd = ['ln', '-sf', '`pwd`/bin/casperjs', '../venv/bin']
    results = subprocess.check_output(cmd,
            shell=True,
            stderr=subprocess.STDOUT)

    #process = subprocess.Popen(cmd, shell=True,
     #                      stdout=subprocess.PIPE, 
      #                     stderr=subprocess.PIPE)

    # wait for the process to terminate
    #results, err = process.communicate()
    #cmd = ['cd', 'casperjs']
    #cmd = ['ln', '-sf', '`pwd`/bin/casperjs', '../venv/bin']
    #results = subprocess.check_output(cmd,
    #        shell=True,
    #        stderr=subprocess.STDOUT)

    #cmd = ['pwd']
    #cmd = ['ln', '-sf', '`pwd`/bin/casperjs', '../venv/bin']
    #results = subprocess.check_output(cmd,
            #shell=True,
            #stderr=subprocess.STDOUT)

    #results = subprocess.call(["casperjs", "search_HON.js"])
    #doi = DOI.objects.filter(doi__icontains=q)
    #time.sleep(5)

    #results = subprocess.check_output(['ls'],
          #  shell=True,
           # stderr=subprocess.STDOUT)

    #f= open('search_link_results.txt', 'r')
    return results

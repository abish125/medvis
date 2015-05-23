#from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import SGDClassifier

import subprocess
import os.path

import copy

class Classifier:

    def __init__(self, targ_source, w_source, web, conf_source, possible_targets):
        self.targets = []
        self.target_source = targ_source
        self.word_source = w_source
        self.conf_source = conf_source
        self.searches = [] 
        self.text_clf = Pipeline([('vect', CountVectorizer()),('tfidf', TfidfTransformer()),('clf', SGDClassifier(loss='hinge', penalty='l2' ,alpha=1e-3, n_iter=5)),])
        self.web = web
        self.results = []
        self.text = ""
        self.possible_targets = possible_targets
        
    def start(self, words_type, words_info, targets_type, targets_info):
        words_wait = False
        if words_type == "file":
            f = open(words_info,"r")
            for r in f.readlines():
                self.searches = self.searches + [r.strip()]
            f.close()
        elif words_type == "list":
            self.searches = words_info
        elif words_type == "match_all":
            words_wait = True
        if targets_type == "file":
            f = open(targets_info, "r")
            for r in f.readlines():
                self.targets = self.targets + [r.strip()]
            f.close()
        elif targets_type == "list":
            self.targets = targets_info
        elif targets_type == "match_all":
            if words_wait:
                print "cannot have both be match_all!"
            else:
                self.targets = [targets_info]*len(self.searches)
        if words_wait:
            self.searches = [words_info]*len(self.targets)
            
        self.searches = self.searches + ["the"]
        self.targets = self.targets + ["no"]
            
        for s in self.searches:
            fname  = s + "_" + self.web + ".txt"
            if os.path.isfile(fname):
                f = open(fname, 'r')
                for r in f.readlines():
                    self.text = self.text + r
                f.close()
            else:
                f = open(fname, 'w')
                self.cmd = ['casperjs search_' + self.web + '.js \'' + s + '\''] #, 'args']
                self.text = subprocess.check_output(self.cmd, shell=True, stderr=subprocess.STDOUT)
                f.write(self.text)
                f.close()
            self.results =  self.results + [self.text]
            self.text=""
            
        self.text_clf = self.text_clf.fit(self.results, self.targets)
        
    def add_terms(self, words_type, words_info, targets_type, targets_info):
        
        how_many_added_searches = 0
        
        words_wait = False
        if words_type == "file":
            f = open(words_info,"r")
            for r in f.readlines():
                how_many_added_searches = how_many_added_searches + 1
                self.searches = self.searches + [r.strip()]
            f.close()
        elif words_type == "list":
            self.searches = words_info
        elif words_type == "match_all":
            words_wait = True
            
        print self.searches
        for s in self.searches:
            fname  = s + "_" + self.web + ".txt"
            if os.path.isfile(fname):
                f = open(fname, 'r')
                for r in f.readlines():
                    self.text = self.text + r
                f.close()
            else:
                f = open(fname, 'w')
                self.cmd = ['casperjs search_' + self.web + '.js \'' + s + '\''] #, 'args']
                self.text = subprocess.check_output(self.cmd, shell=True, stderr=subprocess.STDOUT)
                f.write(self.text)
                f.close()
            self.results =  self.results + [self.text]
            
        if targets_type == "file":
            f = open(targets_info, "r")
            for r in f.readlines():
                self.targets = self.targets + [r.strip()]
            f.close()
        elif targets_type == "list":
            self.targets = targets_info
        elif targets_type == "match_all":
            if words_wait:
                print "cannot have both be match_all!"
            else:
                self.targets = self.targets + [targets_info]*(len(self.results)-len(self.targets))
        #if words_wait:
            #self.searches = self.searches + [words_info]*how_many_added_searches
            
        self.targ_g = open(self.target_source, "w")
        self.targ_g.write("\n".join(self.targets))
        self.targ_g.close()
        self.word_g = open(self.word_source, "w")
        self.word_g.write("\n".join(self.searches))
        self.word_g.close()

        self.text_clf = self.text_clf.fit(self.results, self.targets)
                
    def already_started(self):
        self.targ_f = open(self.target_source, "r")
        for r in self.targ_f.readlines():
            self.targets = self.targets + [r.strip()]
        self.targ_f.close()
            
        self.words_f = open(self.word_source, "r")
        for r in self.words_f.readlines():
            self.searches = self.searches + [r.strip()]
        self.words_f.close()
        
        for s in self.searches:
            fname  = s + "_" + self.web + ".txt"
            if os.path.isfile(fname):
                f = open(fname, 'r')
                for r in f.readlines():
                    self.text = self.text + r
                f.close()
            else:
                f = open(fname, 'w')
                self.cmd = ['casperjs search_' + self.web + '.js \'' + s + '\''] #, 'args']
                self.text = subprocess.check_output(self.cmd, shell=True, stderr=subprocess.STDOUT)
                f.write(self.text)
                f.close()
            self.results =  self.results + [self.text]
            self.text=""

        self.text_clf = self.text_clf.fit(self.results, self.targets)
        
    
    def classify(self, new_search):
        self.new_search = new_search
        
        previous_search = False
        if self.new_search in self.searches:
            previous_search = True
            get_target = self.searches.index(self.new_search)
            true_target = self.targets[get_target]
            return true_target
        else:
            self.cmd = ['casperjs search_' + self.web + '.js \'' + self.new_search + '\'']
            self.new  = [subprocess.check_output(self.cmd, shell=True, stderr=subprocess.STDOUT)]

            self.confidence = self.text_clf.decision_function(self.new)
            self.predicted = self.text_clf.predict(self.new)

            print self.new_search
            print self.predicted[0]

            self.confidences = []
            self.target_answers = []
            self.target_guesses = []
            self.right_wrongs = []

            #self.confidences = self.confidences + [str(max(self.confidence[0]))]
            self.confidences = self.confidences + [str(self.confidence[0])]

            self.got_it_right = False
            

            if self.good_enough(): #self.confidences[-1], self.target_answers[-1]):
                got_it_right = True
                print "above confidence threshold, confidence was:"
                print self.confidences[-1]
                self.searches = self.searches + [self.new_search]
                self.targets = self.targets + [self.predicted[0]]
                self.targ_g = open(self.target_source, "w")
                self.targ_g.write("\n".join(self.targets))
                self.targ_g.close()
                self.word_g = open(self.word_source, "w")
                self.word_g.write("\n".join(self.searches))
                self.word_g.close()
            else:
                answer = input('Is that right? "y"/"n"  ')
                if answer == "y":
                    got_it_right = True
                    print "you answered yes"
                    self.searches = self.searches + [self.new_search]
                    self.targets = self.targets + [self.predicted[0]]
                    self.targ_g = open(self.target_source, "w")
                    self.targ_g.write("\n".join(self.targets))
                    self.targ_g.close()
                    self.word_g = open(self.word_source, "w")
                    self.word_g.write("\n".join(self.searches))
                    self.word_g.close()
                else:
                    print "you ansered no"
                    answer = input("what's the correct answer?  ")
                    #need to change this to include self.possible_targets
                    #also need to include figuring out the confidence rate that it should be
                    if answer in self.possible_targets:
                        self.searches = self.searches + [self.new_search]
                        self.targets = self.targets + [answer]
                        self.targ_g = open(self.target_source, "w")
                        self.targ_g.write("\n".join(self.targets))
                        self.targ_g.close()
                        self.word_g = open(self.word_source, "w")
                        self.word_g.write("\n".join(self.searches))
                        self.word_g.close()
                    else:
                        print "you did not answer"
                
                self.right_wrongs = self.right_wrongs + [str(self.got_it_right)]
                
                '''conf_file_list = []
                for i in range(len(self.confidences)):
                    conf_file_list = conf_file_list + [self.target_guesses[i]] + [self.target_answers[i]] + [self.right_wrongs[i]] + [self.confidences[i]]
                
                self.conf_g = open(self.conf_source, 'w')
                self.conf_g.write("\n".join(conf_file_list))
                self.conf_g.close()'''
            
    def classify_many(self, sentence):
        #so you can use self.classify here
        #classify will call good_enough itself
        words = sentence.split()
        for w in words:
            self.classify(w)
            
    def ask_many(self):
        #this is so you can keep going forward with classifying without being held up on one word
        print "ask_many"
        
    def good_enough(self): #, confidence, current_target):
        return False
        #self.target_guesses
        #self.right_wrongs
        #self.confidences
        #need to make sure you have none that were wrong
        #this will take target and return the number it needs to get to be good enough
        
    def last_ten_calculation(self, target_of_choice):
        #this will calculate the last ten "findings" and see what number it needed to have to hit 8/10 of them
        #then it can set a variable for that matching the possible targets or can return the value
        print "hello"

    def redo_old_confidences(self):
        #needs to be called after self.already_started or self.start
        
        #I guess you need to run every search
        
        self.confidences = []
        self.target_guesses = []
        self.target_answers = []
        self.right_wrongs = []
        
        text = ""
        
        #temp_list_r = copy.copy(self.results)
        #temp_list_t = copy.copy(self.targets)
        
        for c in range(8,len(self.searches)):
            #self.searches[c] is the new search
            '''fname  = self.searches[c-1] + "_" + self.web + ".txt"
            f = open(fname, 'r')
            for r in f.readlines():
                text = text + r 
            f.close()
            self.results =  self.results + [text]
            text=""'''
            
            #print self.results[c]
            #print self.targets[c]
            
            #temp_list_r.remove(self.results[c])
            #temp_list_t.remove(self.targets[c])
            self.text_clf = Pipeline([('vect', CountVectorizer()),('tfidf', TfidfTransformer()),('clf', SGDClassifier(loss='hinge', penalty='l2' ,alpha=1e-3, n_iter=5)),])
            
            if "no" not in self.targets[:c-1]+self.targets[c+1:]:
                self.results = self.results + ["The only definite article in English is the word the, denoting person(s) or thing(s) already mentioned, under discussion, implied, or otherwise presumed familiar to the listener or reader. The is the most commonly used word in the English language, accounting for 7% of all words."]
                self.targets = self.targets + ["no"]
            
            self.text_clf = self.text_clf.fit(self.results[:c-1]+self.results[c+1:], self.targets[:c-1]+self.targets[c+1:])
            
            self.confidence = self.text_clf.decision_function(self.searches[c])
            #print self.targets[:c]
            #print self.results[:c]
            
            #print self.confidence
            
            self.confidences = self.confidences + [str(self.confidence[0])]
            
            self.target_guesses = self.target_guesses + [self.text_clf.predict(self.searches[c])[0]]
            self.target_answers = self.target_answers + [self.targets[c]]
            
            if self.target_answers[-1] == self.target_guesses[-1]:
                self.right_wrongs = self.right_wrongs + ["true"]
            else:
                self.right_wrongs = self.right_wrongs + ["false"]
                
            #temp_list_r = copy.copy(self.results)
            #temp_list_t = copy.copy(self.targets)
            
        right_sum = 0
        right_counter = 0
        wrong_sum = 0
        wrong_counter = 0
        conf_file_list = []
        for i in range(len(self.confidences)):
            conf_file_list = conf_file_list + [self.target_guesses[i]] + [self.target_answers[i]] + [self.right_wrongs[i]] + [self.confidences[i]]
            if self.right_wrongs[i] == "true":
                print True
                sc = self.confidences[i].replace("[","").replace("]","").split()
                print max(sc)
                print self.target_guesses[i]
                print self.target_answers[i]
                right_counter = right_counter +1
                print "\n"
                #right_sum = right_sum + float(self.confidences[i])
            #else:
                #print False
                #print self.confidences[i]
                #print self.target_guesses[i]
                #print self.target_answers[i]
                #wrong_counter = wrong_counter + 1
                #print "\n"
                #wrong_sum = wrong_sum + float(self.confidences[i])
        #print right_sum/right_counter
        #print wrong_sum/wrong_counter
        
        #print right_counter
        #print wrong_counter
        
        #print conf_file_list
        
        self.conf_g = open(self.conf_source, 'w')
        self.conf_g.write("\n".join(conf_file_list))
        self.conf_g.close()
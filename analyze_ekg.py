'''from PIL import Image
im = Image.open('ekg.jpg')

pixels = list(im.getdata())
width, height = im.size
pixels = [pixels[i * width:(i + 1) * width] for i in xrange(height)]

print pixels'''

import numpy as np
import matplotlib.pyplot as plt

from skimage.data import camera
from skimage.filters import roberts, sobel, scharr, prewitt
from scipy import misc

import skimage.io as io

#from PIL import Image
#im = Image.open("ekg12.gif")
from PIL import Image

img = Image.open('ekg12.gif').convert('LA')
img.save('greyscale.gif')
img.show()

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

#pix_val_flat = [x for sets in pix for x in sets]
#print pix_val_flat

for i in range(img.size[0]):
	for j in range(img.size[1]):
		if pix[i,j]< 100:
			#if previous == i:
			#	pix[i,j] = 255
			pix[i,j]=0
			previous = i
		else:
			pix[i,j] = 255

img.show()

'''
for g in groups_of_rows:
	for r in range(len(g)):
		if r!= len(g)-1:
			pix[g]
'''
			


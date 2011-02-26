#!/usr/bin/env python

import string
import filepost
import StringIO
import urllib
import urllib2
import httplib
import os

def filenameFromUrl(url): # Encodes a url and return a safe and unique filename
	return url
	
def urlFromFilename(filename): # Decodes a filename back into it's URL form
	return filename

def fetchUrls(urls): # Downloads a list of objects by url
	result = []
	for url in urls:
		print "Retrieving url: " + url 
		result.append(urllib2.urlopen(url))
	return result

def uploadImages(imageUrlFiles, prefix = "OpalFruit-"):
	params = {"method": "add"}
	imageObjects = []
	i = 0
	host="piximilar-rw.hackott.tineye.com"
	url="/rest/"
	port=80
	for imageFile in imageUrlFiles:
		buffer = StringIO.StringIO(imageFile.read());
		key = "images[" + str(i) + "]"
		i = i + 1
		filename = prefix + imageFile.geturl()[7:] # strip the http
		imageObjects.append((key , filename , buffer.getvalue()))
		print "Adding image " + filename
	postdata = filepost.encode_multipart_formdata(params, imageObjects)
	try:
		con = httplib.HTTPConnection(host, port)
		con.request("POST", url, postdata[1], headers={"Content-Type": postdata[0]})
		response = con.getresponse()
		print response.read()
	except Exception, e:
		print e
		pass



	
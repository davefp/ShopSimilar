
from google.appengine.api import urlfetch

def colourSearch(colours):
    #colours is a list
    params = {"method": "color_search"}

    colourStrings = []

    url = 'http://piximilar-rw.hackott.tineye.com/rest/?method=color_search&'
    num = 0

    for colour in colours:
        newColourString = (str)(colour[0]) + ',' + (str)(colour[1]) + ',' + (str)(colour[2])
        url += "colors[" + str(num) + "]="
        url += newColourString
        url += '&'

    url += 'weights[0]=1'
    print url
    response = urlfetch.fetch(url)

    print response.content

    


    
        

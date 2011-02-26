#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import md5
import base64
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.api import urlfetch

import BeautifulSoup


class MainHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write('Hello world!')

        

class PostInstall(webapp.RequestHandler):
    def get(self):
        #grab params
        shop = self.request.get("shop")
        t = self.request.get("t")
        timestamp = self.request.get("timestamp")
        signature = self.request.get("signature")

        #prepare the auth string
        paramsList = []
        paramsList.append('shop=' + shop)
        paramsList.append('t=' + t)
        paramsList.append('timestamp=' + timestamp)
        print paramsList
        paramsList.sort()
        prehash = paramsList[0] + paramsList[1] + paramsList[2]
        print prehash
        
        #opal fruit shared secret: c2dc05b6fe55a38ecd1fe2ee9e614db8
        sharedSecret = 'c2dc05b6fe55a38ecd1fe2ee9e614db8'
        #api key: b30e1bed92b052ae6cf6a01ba0bef581
        apikey = 'b30e1bed92b052ae6cf6a01ba0bef581'
        posthash = md5.new()
        posthash.update(sharedSecret + prehash)
        print posthash.hexdigest()
        print signature
        if(posthash.hexdigest() == signature):
            print 'auth successful'
            imagerequesturl = 'https://gleason-and-sons4755.myshopify.com' + '/admin/products.xml?fields=images'
            password =  md5.new(sharedSecret + t).hexdigest()

            print imagerequesturl
            result = urlfetch.fetch(imagerequesturl,
                        headers={"Authorization": 
                                 "Basic %s" % base64.b64encode(apikey + ':' + password)})

            soup = BeautifulSoup.BeautifulStoneSoup(result.content)
            print soup.prettify()

            images = soup.findAll('images')
            print images

            
            #set up shop url for posting stuff to it
            #GET /admin/products/#{id}/images.xml
            
        else:
            print 'auth failed'



        


def main():
    application = webapp.WSGIApplication([('/', MainHandler),
                                            ('/postInstall', PostInstall)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()

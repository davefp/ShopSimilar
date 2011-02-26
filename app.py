import md5
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class PostInstall(webapp.RequestHandler):
    def get(self):
        #prepare the auth string
        shop = self.request.get("shop")
        t = self.request.get("t")
        timestamp = self.request.get("timestamp")
        signature = self.request.get("signature")

        prehash = 'shop=' + shop + 't=' + t + 'timestamp=' + timestamp

        sharedSecret = 'blah'
        posthash = md5.new()
        posthash.update(prehash)
        
 

        
        

application = webapp.WSGIApplication(
                                     [('/postInstall', PostInstall)],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()

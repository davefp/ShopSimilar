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

        #opal friut api key: b30e1bed92b052ae6cf6a01ba0bef581
        sharedSecret = 'b30e1bed92b052ae6cf6a01ba0bef581'
        posthash = md5.new()
        authsig = posthash.update(prehash).digest()
        if(authsig == signature):
            print 'auth successful'
        else:
            print 'auth failed'
        
        
 

        
        

application = webapp.WSGIApplication(
                                     [('/postInstall', PostInstall)],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()

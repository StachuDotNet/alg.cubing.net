# How to handle Karma+Jasmine in alg.cubing.net

We've implemented some unit tests within the system, and these help us stay sane.
Here are some steps to get you running to this point: http://i.imgur.com/HPpPkFa.png


First, have NodeJs installed on your machine.

 - see [nodejs.org](http://nodejs.org/) for most details of how to install.
 - If you're on Windows, I highly recommend using Chocolatey in general, because it's awesome.

Once you have node installed, open up your command prompt equivalent.

Type this:
    npm install karma karma-jasmine karma-chrome-launcher -g

Then, navigate your prompt to your alg.cubing.net folder

Finally, type 
    karma start testing/karma.conf.js

That's it. Google for more.
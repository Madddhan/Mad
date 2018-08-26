import os

for x in range(0,1000):
    myfile="image/frame%d.jpg" % x
 
    ## if file exists, delete it ##
    if os.path.isfile(myfile):
            os.remove(myfile)
    else:    ## Show an error ##
            break

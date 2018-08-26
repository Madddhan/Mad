import numpy as np
import cv2

cap = cv2.VideoCapture('output.avi')
fgbg = cv2.createBackgroundSubtractorMOG2()

fourcc = cv2.VideoWriter_fourcc(*"XVID")
out    = cv2.VideoWriter('outputbg.avi', fourcc, 17.0, (640,480))

while(1):
    
    ret, frame = cap.read()
    
   
    fgmask = fgbg.apply(frame)
    frame = cv2.cvtColor(fgmask, cv2.COLOR_GRAY2RGB)
    out.write(frame)
    cv2.imshow('Background Subtraction',fgmask)
    
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break
    
cap.release()
cv2.destroyAllWindows()


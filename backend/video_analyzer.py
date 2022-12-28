import os
import cv2
import numpy as np
from nltk.corpus import stopwords
from uuid import uuid1
from utils import cprint

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing import image


face_classifier = cv2.CascadeClassifier('support\\haarcascade_frontalface_default.xml')
classifier =load_model('support\\Emotion_little_vgg.h5')
stopwords = set(stopwords.words('english'))

def emotion_analyse(file_path, handler):
    file_path =  check_video_file(file_path)
    handler.status['label'] = {'Angry':0, 'Happy': 0, 'Neutral':0, 'Sad':0, 'Surprise':0}
    handler.status['processed'] = 0
    cap = cv2.VideoCapture(file_path)
    handler.status['frames'] = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    class_labels = ['Angry','Happy','Neutral','Sad','Surprise']
    while not handler.interrupt:
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray,1.3,5)
        if len(faces) > 0:
            x,y,w,h = faces[0]
            cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
            roi_gray = gray[y:y+h,x:x+w]
            roi_gray = cv2.resize(roi_gray,(48,48),interpolation=cv2.INTER_AREA)
            if np.sum([roi_gray])!=0:
                roi = roi_gray.astype('float')/255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi,axis=0)
                preds = classifier.predict(roi)[0]
                label = class_labels[preds.argmax()]
                handler.status['label'][label] +=1
        handler.status['processed'] += 1
        
    cap.release()
    cv2.destroyAllWindows()
    return handler.status
    
def check_video_file(file_path):
    _path, file_name = os.path.split(file_path)
    split_list = file_name.split('.')
    extension = split_list[-1] if len(split_list) >1 else None

    if extension == 'webm':
        new_file_path = os.path.join(_path, f'{uuid1()}.mp4')
        command = f'.\support\\ffmpeg -v quiet -stats -hwaccel qsv -i {file_path} -r 15 -c:v h264_qsv -preset faster {new_file_path}'
        cprint(command)
        os.system(command)
        return new_file_path
    return file_path

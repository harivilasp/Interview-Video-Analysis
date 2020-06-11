from vedio_to_text import vedio_to_text
from audio_analysis import audio_analysis
from emotion_analyse import emotion_analyse
from text_sentiment import text_sentiment
import pandas as pd

vedio_to_text()
audio_analysis()
emotion_analyse()
text_sentiment()
audiodata=pd.read_csv("audioCues.csv")
print(audiodata)

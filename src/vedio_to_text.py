import os
import speech_recognition as sr

def vedio_to_text():
    command2mp3 = "ffmpeg -i input\\vedio.mkv gen\\audio.mp3"
    command2wav = "ffmpeg -i gen\\audio.mp3 audio.wav"

    os.system(command2mp3)
    os.system(command2wav)
    r = sr.Recognizer()
    audio = sr.AudioFile('audio.wav')
    with audio as source:
        audio = r.record(source, duration=100)
        text=r.recognize_google(audio)
        file = open(r"output\\text.txt","w+")
        file.writelines(text)
        file.close()

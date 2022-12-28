import os
import wave
import librosa
import numpy as np
from uuid import uuid1
import speech_recognition as sr

from utils import cprint


def video_to_text(file_path):
    audio_path = f'uploads\\{uuid1()}.wav'
    text_file_path = f'uploads\\{uuid1()}.txt'
    command2wav = f"support\\ffmpeg -i {file_path} -v quiet -vn -acodec pcm_s16le -ar 44100 -ac 2 {audio_path}"
    cprint(command2wav)
    os.system(command2wav)
    r = sr.Recognizer()
    audio = sr.AudioFile(audio_path)

    speech_text = []
    with audio as source:
        audio = r.record(source, duration=300)
        try:
            text = r.recognize_google(audio)
        except sr.UnknownValueError:
            text = ''

        with open(text_file_path, "w+") as file:
            file.write(text)
            speech_text.append(text)

    speech_text = ' '.join(speech_text)
    return audio_path, speech_text


def speech_speed(audio_path, speech_text):
    word_count = len(speech_text.split())
    with wave.open(audio_path, 'r') as f:
        frames = f.getnframes()
        rate = f.getframerate()

    duration_min = frames / (rate * 60)
    wpm = word_count / duration_min
    speed = 'Slow'
    if wpm > 120 and wpm <= 160:
        speed = 'Medium'
    elif (wpm > 160):
        speed = 'Fast'

    return wpm, speed


def pause_detection(audio_path):
    TOP_DB_LEVEL = 30

    x, sr = librosa.load(audio_path)
    y = librosa.amplitude_to_db(abs(x))
    refDBVal = np.max(y)
    n_fft = 2048
    S = librosa.stft(x, n_fft=n_fft, hop_length=n_fft // 2)
    D = librosa.amplitude_to_db(np.abs(S), ref=np.max)

    topDB = TOP_DB_LEVEL

    nonMuteSections = librosa.effects.split(x, topDB)
    total_time = nonMuteSections[-1][-1] / sr

    initial_pause = nonMuteSections[0][0] / sr
    initial_pause_percent = initial_pause * 100 / total_time

    mute = nonMuteSections[0][0]
    for i in range(1, len(nonMuteSections)):
        mute += (nonMuteSections[i][0] - nonMuteSections[i - 1][1])
    mute = mute / sr

    mute_percent = (mute * 100) / total_time

    return initial_pause_percent, mute_percent


def find_filler_words(speech_text):
    speech_text = speech_text.split()

    filler_words = ["like", "um", "might", "aa", "aaa", "mean", "know", "well", "totally",
                    "really", "basically", "no", "oh", "so", "maybe", "somehow", "some", "okay", "very"]

    total_filler_words = 0
    for word in filler_words:
        total_filler_words += speech_text.count(word)
    percent = (total_filler_words / max(len(speech_text), 1)) * 100
    return total_filler_words, percent


def analize_audio(file_path):
    audio_path, speech_text = video_to_text(file_path)

    wpm, speed = speech_speed(audio_path, speech_text)
    initial_pause_percent, mute_percent = pause_detection(audio_path)
    total_filler_words, filler_percent = find_filler_words(speech_text)

    output = {
        'wpm': wpm,
        'speed': speed,
        'initial_pause_percent': initial_pause_percent,
        'mute_percent': mute_percent,
        'total_filler_words': total_filler_words,
        'filler_percent': filler_percent
    }

    return output

import re
from utils import cprint
import requests
import urllib3
import pdfplumber
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = ''

if 'API_KEY' not in locals() or (not API_KEY):
    cprint('NO API KEY FOUND. ADD api key with variable `API_KEY = <YOUR_API_KEY>`', color = 'red')
    raise Exception('no api key')

def parse_pdf(file_path):
    content =''
    with pdfplumber.open(file_path) as pdf:
        for i in range(len(pdf.pages)):
            page = pdf.pages[i]
            content += page.extract_text()
    return content


def removeStopWords(txt):
    stop_words = set(stopwords.words('english'))
    txt=txt.lower()
    word_tokens = word_tokenize(txt)
    filtered_sentence = []
    for w in word_tokens:
        if w not in stop_words:
            filtered_sentence.append(w)
    return ' '.join(filtered_sentence)

def removePunctuations(text):
    text = re.sub(r"(@\[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)|^rt|http.+?", "", text)
    return text

def cleanText(text):
    return removeStopWords(removePunctuations(text))


def findsim(resume_text, job_desc):
    API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/bert-base-nli-mean-tokens"
    headers = {"Authorization": f'Bearer {API_KEY}'}
    payload = {
        "inputs": {
            "source_sentence": resume_text,
            "sentences": [
                job_desc
            ]
        },
    }

    response = requests.post(API_URL, headers=headers, json=payload, verify = False)
    return response.json()

def start_similary(file_path, job_description):
    resume_text = parse_pdf(file_path)
    cleaned_resume = cleanText(resume_text)
    cleaned_job_desc = cleanText(job_description)
    result = findsim(cleaned_resume, cleaned_job_desc)
    return result[0]*100

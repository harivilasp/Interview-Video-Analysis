import requests
from nltk.corpus import stopwords 
#from nltk.tokenize import word_tokenize 
  
#example_sent = "This is a sample sentence, showing off the stop words filtration."
stopwords = set(stopwords.words('english'))

def text_sentiment():
    file1 = open("output\\text.txt","r") 
    print("Output of Readlines afte")
    data=file1.readlines()
    print(data)
    file1.close()
    # Remove stop words
    #stopwords = set(stopwords.words('english'))
    #print(stopwords) 
    output = []
    for sentence in data:
        temp_list = []
        for word in sentence.split():
            if word.lower() not in stopwords:
                temp_list.append(word)
        output.append(' '.join(temp_list))

    r = requests.post(
        "https://api.deepai.org/api/sentiment-analysis",
        data={
            'text': output,
        },
        headers={'api-key': '8b3f2d35-c115-4059-9e68-d14a7099659e'}
    )
    print(r.json()['output'])

text_sentiment()

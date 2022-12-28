import os

from mongo import mongo
from utils import unique_id, cprint
from bson import ObjectId

class TaskStore:
    def __init__(self):
        self.store = {}

    def create_stream_file(self, interview_id):
        cprint(interview_id)
        file_location = mongo.db.interview_list.find_one({'_id' : ObjectId(interview_id)})['filename']
        stream_id = unique_id()
        self.store[stream_id] = StreamHandler(file_location)
        return stream_id

class StreamHandler:
    def __init__(self, file_location):
        # if (os.path.isfile(file_location)):
        #     os.remove(file_location)
                
        self.file = open(file_location, 'ab')
    
    def write_stream(self, stream_data):
        self.file.write(stream_data)
        self.file.flush()
        

task_store = TaskStore()
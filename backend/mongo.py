import pymongo
from uuid import uuid1
from utils import cprint
from datetime import datetime

unique_id = lambda : str(uuid1())

class Mongo:
    def __init__(self, db_name, init_function = None):
        cprint('Mongo Database initialised', color = 'yellow')
        self.db = pymongo.MongoClient()[db_name]

        if init_function != None:
            init_function(self.db)

def initialize_database(db):
    # Initialize Users
    # insert company and student credentials if not exists
    if not db.usercred.find_one({'username': 'company1'}):
        db.usercred.insert_one({'username': 'company1', 'password': 'comp1@123', 'name': 'COMPANY 1', 'interviewer': True})

    if not db.usercred.find_one({'username': 'company2'}):
        db.usercred.insert_one({'username': 'company2', 'password': 'comp2@123', 'name': 'COMPANY 2', 'interviewer': True})

    if not db.usercred.find_one({'username': 'hari_vilas'}):
        db.usercred.insert_one({'username': 'hari_vilas', 'password': 'hari@123', 'name': 'Hari Vilas', 'interviewer': False})

    # Initialize jobs
    count = db.job_list.count_documents({})
    if not count:
        db.job_list.insert_one({
                                'designation': 'Java Dev',
                                'location': 'Bangalore',
                                'experience': '0-5 years',
                                'industry': 'IT Services & Consulting',
                                'employment_type': 'Full Time',
                                'skills': 'spring bootjavaweb servicessql Cicd Pipeline',
                                'salary': '1000000',
                                'education': 'B.Sc in Computers, B.Tech/B.E. in Any Specialization, BCA in Any Specialization',
                                'job_description':'''Experience in analysis, design, development, documentation, implementing, and testing of
software systems in Java, J2EE, and Internet technologies.

Good experience in Java platform (JDK 1.5+)
Experience in OOPS concepts and design patterns, data structures, algorithms, and java collections framework Exposure to SQL basics and SQL joins
Experience in REST based Web services
Familiarity with modern front-end CI-CD build pipelines and tools (Maven/Gradle)
Implement unit test cases in frameworks (Junit/TestNG)
Ability to understand business requirements and translate them into technical requirements
A knack for benchmarking and optimization
Familiarity with code versioning tools such as GIT
Familiarity with the Agile development methodology, especially SCRUM''',
                                'lister': 'company1',
                                'applied' : []})
        
    count = db.user_details.count_documents({})
    
    if not count:
        db.user_details.insert_one({'username': 'hari_vilas',
                                    'profile_image': 'https://avatars.githubusercontent.com/u/44021418?v=4',
                                    'first_name': 'Hari',
                                    'last_name': 'Vilas Panjwani',
                                    'e_mail': 'hari.vilas2018@vitstudent.ac.in',
                                    'phone': '8340125941',
                                    'job': 'Software Developer',
                                    'about': '''I’m a software developer who has been working in the field for eight years. I’m passionate about creating quality products that meet all of the customer’s needs, and I love learning new techniques and technologies that allow me to make that happen.

In 2012, I graduated from the University of Chicago with a degree in software development, and from there I went straight into an internship at Chicago Technologies. During the year I was there, I learned how to develop software at a professional level and got practice communicating with clients and estimating projects.

After that, I started working at Illinois Software Company as a junior developer. A year into that job, I was promoted to senior developer, which meant I handled my own projects and checked the junior developers’ before they went to the client. I held that position until the company went under last month.''',
                                    'experience': [['SDE 1 (2022 - Present)', 'Computer Science (2022)'],
                                                   ['Computer Science (2022)', 'VIT, Chennai'],
                                                   ['12<sup>th</sup> (2017)', 'Modern Public School, Kota']],
                                   'current_salary': '1000000',
                                   'expected_salary': '1250000',
                                   'resume_location':''})

mongo = Mongo('capstone', initialize_database)

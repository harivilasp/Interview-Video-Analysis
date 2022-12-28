# Creates a queue of Jobs and return response when asked for status or result.

# Not a production level code. Will lose state when program is closed.
# Not a persistent, relaible way of hadling jobs in server.

import asyncio
import threading
import traceback
from random import choices
from string import ascii_lowercase, digits


from utils import cprint


class ProgressHandler:
    def __init__(self):
        self.status = {}
        self.interrupt = False

class Job:
    def __init__(self, _id, job_func,*args, **kwargs):
        self.status = -2  # -2 Not started, -1 Failed, 0 Running, 1 Success
        self._id = _id
        self.job_func = job_func
        self.args = args
        self.kwargs = kwargs
        self.handler = None
        if ('attach_handler' in kwargs and kwargs['attach_handler']):
            self.handler = ProgressHandler()
            self.kwargs['handler'] = self.handler
            del kwargs['attach_handler']

    def run_job(self):
        self.status = 0
        cprint(f"Task {self._id} Started")
        try:
            self.result = self.job_func(*self.args, **self.kwargs)
        except Exception as ex:
            cprint(f"Task {self._id} Failed", color = 'red')
            cprint("".join(traceback.TracebackException.from_exception(ex).format()), color='red')
            self.status = -1
            return
        self.status = 1

    def get_job_status(self):
        response = {'status': 'Success'}
 
        if self.status == -1:
            response['status'] = 'Failed'
        
        elif self.status == 0 or self.status == -2:
            response['status'] = 'Running'
            if self.handler:
                response['progress'] = self.handler.status
        else:
            response['result'] = self.result

        return response

    def interrupt_process(self):
        self.handler.interrupt = True
    

class JOB_Manager:
    new_job_id = lambda x: "".join(choices(ascii_lowercase + digits, k=8))
    
    def __init__(self):
        self.job_list = {}
        self.completed_job = {}
        self.therad_running = False

    def add_job(self, job_func, *args, **kwargs):
        '''Adds a new job to job_list'''      

        if not self.therad_running:
            # Starting thread before flask is initialized, hinders flask reload in debug mode.

            threading.Thread(target=asyncio.run, args=(job_manager.check_job(),), daemon=True).start()
            self.therad_running = True

        job_id = self.new_job_id()
        while self.job_list.get(job_id, False):
            job_id = self.new_job_id()

        self.job_list[job_id] = Job(job_id, job_func, *args, **kwargs)
        return job_id

    def get_status(self, job_id):
        '''Get status of any scheduled job'''
        _job: Job = self.job_list.get(job_id, None)

        if _job == None:
            _job = self.completed_job.get(job_id, None)

        if _job == None:
            return 'Job not found'

        return _job.get_job_status()

    async def check_job(self):
        '''Checks for any scheduled job every .5 sec'''

        while True:
            for job_id in self.job_list:
                _job = self.job_list[job_id]

                if _job.status == -2:
                    _job.run_job()
                    break

            if 'job_id' in locals() and self.job_list[job_id]:
                self.completed_job[job_id] = _job
                del self.job_list[job_id]
                del job_id

            await asyncio.sleep(.5)
    
    def terminate_all(self):
        for job_id in self.job_list:
            self.job_list[job_id].interrupt_process()

    

job_manager = JOB_Manager()

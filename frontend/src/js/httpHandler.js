import axios from 'axios'
import { updateLogin } from '../redux/actions/actions'

const BASE_URL = 'http://localhost:5000';


const PostRequest = async (_url, payload, isJson = true) => {
    const url = BASE_URL + _url
    const headers = {
        'Access-Control-Allow-Origin': '*',
    }

    if (isJson)
        headers['Content-Type'] = 'application/json';
    return await axios.post(url, payload,
        {
            withCredentials: true,
            headers: headers,
        })
        .then((res) => {
            return { status: true, response: res.data }
        })
        .catch(err => {
            if (err.response && err.response.status && err.response.data) {
                return { status: false, msg: err.response.data.msg }
            }
            return { status: false, msg: 'Error in network connection' }
        })
}


const GetRequest = async (_url, params = null) => {
    const url = BASE_URL + _url;
    const options = {
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    if (params && (params.constructor === Object && (Object.keys(params).length > 0))) {
        options['params'] = params
    }

    return await axios.get(url, options)
        .then(res => { return { status: true, response: res.data } })
        .catch(err => {
            if (err.response && err.response.status && err.response.data) {
                return { status: false, msg: err.response.data.msg }
            }
            return { status: false, msg: 'Error in network connection' }
        })
}

export const loginUser = async (notifier, userDetails, dispatch, navigate) => {
    const resp = await PostRequest('/login_user', userDetails);
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }

    else{
        dispatch(updateLogin(resp.response.userData));
        localStorage.setItem('session', JSON.stringify(resp.response.userData))
        return navigate('/');
    }
}

export const getCandidateInterview = async (notifier) => {
    const resp = await GetRequest('/interview_list');
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return []
    }
    return resp.response.interview_data
}


export const getCandidateJobs = async (notifier) => {
    const resp = await GetRequest('/job_list');
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return []
    }
    return resp.response.job_data
}


export const applyJob = async (notifier, job_id) => {
    const resp = await GetRequest('/apply_job', { 'job_id': job_id });
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return []
    }
    return resp.response;
}

export const withdrawApplication = async (notifier, job_id) => {
    const resp = await GetRequest('/withdrawApplication', { 'job_id': job_id });
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return []
    }
    return resp.response
}

export const getCompanyInterview = async (notifier) => {
    const resp = await GetRequest('/interview_company_list');
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return []
    }
    return resp.response.interview_data
}

export const setInterviewStatus = async (notifier, _id, isEnabled) => {
    const resp = await GetRequest('/set_interview_status', { '_id': _id, value: isEnabled });
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response
}
export const setInterviewComplete = async (notifier, _id) => {
    const resp = await GetRequest('/set_interview_complete', { '_id': _id })
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response
}

export const getInterviewerOpenings = async (notifier,) => {
    const resp = await GetRequest('/openingsPosted');
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return []
    }
    return resp.response.openings
}


export const getCandidateProfile = async (notifier, candidate_username) => {
    const params = {}
    if (candidate_username)
        params['candidate_username'] = candidate_username;

    const resp = await GetRequest('/candidateProfile', params);
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return []
    }
    return resp.response.profile
}

export const uploadCandidateResume = async (notifier, file) => {
    const formData = new FormData();
    formData.append(
        "resume",
        file,
        file.name
    );

    const resp = await PostRequest('/uploadResume', formData);
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response.resume_location
}

export const modifyJob = async (notifier, job_data) => {
    const resp = await PostRequest('/modifyJob', job_data)
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response.jobRecord
}

export const deleteJob = async (notifier, job_id) => {
    const resp = await GetRequest('/deleteJob', { 'job_id': job_id })
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response
}

export const getJobData = async (notifier, job_id) => {
    const resp = await GetRequest('/getJobData', { 'job_id': job_id })
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return {}
    }
    return resp.response
}

export const analizeCanadidateResume = async (notifier, candidate_username, job_id) => {
    const resp = await PostRequest('/processResumeJob', { 'candidate_usernmae': candidate_username, 'job_id': job_id })
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response

}

export const getTaskStatus = async (notifier, task_id) => {
    const resp = await GetRequest('/getTaskStatus', { 'task_id': task_id })
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response
}

export const scheduleCandidateInterview = async (notifier, payload) => {
    const resp = await PostRequest('/scheduleCandidateInterview', payload);
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response
}

export const getStreamId = async (notifier, interview_id) => {
    const resp = await GetRequest('/initializeInterviewStream', { 'interview_id': interview_id });
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response;
}

export const sendBlobData = async (notifier, streamId, blob_data) => {
    const formData = new FormData();
    formData.append('blob_data', blob_data)
    formData.append('stream_id', streamId)
    PostRequest('/postBlob', formData);
}

export const analizeCanadidateVideo = async (notifier, video_path) => {
    const resp = await GetRequest('/analyzeCandidateInterview', { 'filePath':  video_path})
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response

}

export const analizeCanadidateAudio = async (notifier, video_path) => {
    const resp = await GetRequest('/analizeCanadidateAudio', { 'filePath':  video_path})
    if (!resp.status) {
        if (resp.msg)
            notifier(resp.msg)
        return ''
    }
    return resp.response

}
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Footer from '../Components/Footer'
import Navbar, { linkList } from '../Components/Navbar'
import InputBox from '../Components/InputBox'
import { useNavigate, useLocation, use } from 'react-router-dom';
import { modifyJob, deleteJob, getJobData } from '../js/httpHandler';
import { useIsMount, useNotifier } from '../js/utils';

const InterviewerNewOpening = ({_id}) => {
    const notifier = useNotifier();
    const [isEditable, setEditable] = useState(true);
    const [jobIdAvailable, setjobIdAvailable] = useState(false);
    const [jobData, UpdateJobData] = useState({
        '_id': '',
        'designation': '',
        'location': '',
        'experience': '',
        'industry': '',
        'employment_type': '',
        'skills': '',
        'salary': '',
        'education': '',
        'job_description': '',

    })

    const location = useLocation();
    const navigate = useNavigate();
    const notify = useNotifier();
    const firstMount = useIsMount();

    const refs = {
        'DESIGNATION': useRef(),
        'LOCATION': useRef(),
        'EXPERIENCE': useRef(),
        'INDUSTRY': useRef(),
        'SALARY': useRef(),
        'EMPLOYMENT_TYPE': useRef(),
        'SKILLS': useRef(),
        'EDUCATION': useRef(),
        'JOB_DESCRIPTION': useRef(),
    }

    useEffect(() => {
        const loadJobData = async (job_id) => {
            const response = await getJobData(notifier, job_id);
            if (Object.keys(response).length > 0) {
                UpdateJobData(response)
                disableEditing();
                setjobIdAvailable(true);
            }

        };
        if (firstMount && _id) {
            loadJobData(_id);
        };

    }, []);

    useEffect(() => {
        setInputValue();
    }, [jobData]);

    Object.freeze(refs);

    const enableEditing = () => {
        Object.values(refs).forEach((_ref, index) => {
            _ref.current.removeAttribute('disabled', false);
        })
        setEditable(true);
    }

    const disableEditing = () => {
        Object.values(refs).forEach((_ref, index) => {
            _ref.current.setAttribute('disabled', true);
        })
        setEditable(false);
    }

    const postJob = async () => {
        const payload = {
            '_id': jobData._id,
            'designation': refs.DESIGNATION.current.value,
            'location': refs.LOCATION.current.value,
            'experience': refs.EXPERIENCE.current.value,
            'industry': refs.INDUSTRY.current.value,
            'employment_type': refs.EMPLOYMENT_TYPE.current.value,
            'skills': refs.SKILLS.current.value,
            'salary': refs.SALARY.current.value,
            'education': refs.EDUCATION.current.value,
            'job_description': refs.JOB_DESCRIPTION.current.value,
        }

        const response = await modifyJob(notifier, payload);
        if (Object.keys(response).length !== 0) {
            UpdateJobData(response);
            setjobIdAvailable(true);
            disableEditing();
        }
    }

    const setInputValue = () => {
        refs.DESIGNATION.current.value = jobData.designation;
        refs.LOCATION.current.value = jobData.location;
        refs.EXPERIENCE.current.value = jobData.experience;
        refs.INDUSTRY.current.value = jobData.industry;
        refs.EMPLOYMENT_TYPE.current.value = jobData.employment_type;
        refs.SKILLS.current.value = jobData.skills;
        refs.SALARY.current.value = jobData.salary;
        refs.EDUCATION.current.value = jobData.education;
        refs.JOB_DESCRIPTION.current.value = jobData.job_description;

    }

    const deleteJobPost = async () => {
        if (jobData._id === '')
            return

        const response = await deleteJob(notifier, jobData._id)
        if (response !== '') {
            notify(response);
            setTimeout(() => {
                navigate('/postOpening', {state: {}, replace:true})
                window.location = '/postOpening'
            }, 2000)
        }
    }

    const cancelEdit = () => {
        setInputValue();
        disableEditing();
    }

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.INTERVIEWER_NEW_OPENING} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    {(jobIdAvailable) ? 'Your Job opening' : 'Post new Job'}
                </span>
                <div className='job-post-container'>
                    <span style={{ fontSize: '1.2rem', fontWeight: '600' }}> Job Details</span>

                    <div className='job-details'>
                        <span className='job-details-field'>Designation</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.DESIGNATION} />

                        <span className='job-details-field'>Location</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.LOCATION} />

                        <span className='job-details-field'>Experience</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.EXPERIENCE} />

                        <span className='job-details-field'>Industry</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.INDUSTRY} />

                        <span className='job-details-field'>Salary</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.SALARY} />

                        <span className='job-details-field'>Employment Type</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.EMPLOYMENT_TYPE} />

                        <span className='job-details-field'>Skills</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.SKILLS} />

                        <span className='job-details-field'>Education</span>
                        <InputBox style={{ height: '35px' }} clsName='custom-input-style' ref={refs.EDUCATION} />

                        <span className='job-details-field'>Job Description</span>
                        <textarea rows='10' cols='10' ref={refs.JOB_DESCRIPTION} />
                    </div>

                    <div className='job-control-container'>
                        {(!jobIdAvailable) && <button className='custom-blue' onClick={postJob}>Post Job</button>}
                        {(jobIdAvailable && (!isEditable)) &&
                            <>
                                <button className='custom-blue' onClick={deleteJobPost}>Delete Job Post</button>
                                <button className='custom-blue' onClick={enableEditing}>Edit Job Post</button>
                            </>}
                        {(jobIdAvailable && isEditable) &&
                            <>
                                <button className='custom-blue' onClick={cancelEdit}>Cancel Edit</button>
                                <button className='custom-blue' onClick={postJob}>Save Edit</button>
                            </>
                        }

                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default InterviewerNewOpening
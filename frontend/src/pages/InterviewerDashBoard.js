import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar, { linkList } from '../Components/Navbar'
import Footer from '../Components/Footer'
import { getCompanyInterview, setInterviewStatus, setInterviewComplete } from '../js/httpHandler'
import { useNotifier } from '../js/utils'


const InterviewerDashBoard = () => {
    const [interviewList, updateInterviewList] = useState([]);
    const navigate = useNavigate();
    const notifier = useNotifier();

    useEffect(() => {
        // Use effect renders twice
        // https://stackoverflow.com/a/60619061
        const fetchInterviewDetails = async () => {
            const interviewData = await getCompanyInterview(notifier);
            updateInterviewList(interviewData);
        };
        fetchInterviewDetails();
    }, []);

    const toggleInterview = async (_id, isEnabled) => {
        let setValue = !(isEnabled);
        setValue = setValue.toString();
        const response = await setInterviewStatus(notifier, _id, setValue);

        if (response) {
            // Reload page
            return navigate(0);
        }
    }

    const completeInterview = async (_id) => {
        const response = await setInterviewComplete(notifier, _id);
        if (response) {
            // Reload page
            return navigate(0);
        }
    }

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.HOME} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    Interviews</span>
                <div className='interview-list-container'>
                    {
                        interviewList.map((item, index) => {
                            const interview_timestamp = new Date(item.time);
                            const interview_time = `${interview_timestamp.toLocaleTimeString()} ${interview_timestamp.toLocaleDateString()}`
                            const interview_status = (item.completed) ? 'Interview Completed' : (item.enabled) ? 'Interview started' : 'Interview not yet started'

                            return (
                                <div className='interview-item' key={index}>
                                    <div className='interview-details'>
                                        <div>Interviewee Id:</div><b>{item.candidate}</b>
                                        <div>Role:</div> <b>{item.designation}</b>
                                        <div>Salary:</div> <b>{item.salary}</b>
                                        <div>Time: </div><b>{interview_time}</b>
                                        <div>Status: </div><b>{interview_status}</b>
                                    </div>
                                    <div className='job-control-container' style={{ justifyContent: 'flex-end' }}>
                                        {
                                            (item.enabled && (!item.completed)) &&
                                            <button className='custom-blue' onClick={() => { completeInterview(item._id) }}> Complete Interview</button>
                                        }
                                        {
                                            (!item.completed) && <button className='custom-purple' onClick={() => { toggleInterview(item._id, item.enabled) }}>
                                                {(item.enabled) ? 'Disable Interview' : 'Enable Interview'} </button>

                                        }

                                        {
                                            (item.completed) &&
                                            <button className='custom-blue' onClick={() => {
                                                navigate('CandidateAnalysis', {
                                                    state: {
                                                        props: {
                                                            'candidate_username': item.candidate,
                                                            'video_path': item.filename,
                                                            'job_id': item.job_id,
                                                            'designation': item.designation}
                                                    }
                                                })
                                            }}> Analize Interview</button>

                                        }
                                    </div>

                                </div>)
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default InterviewerDashBoard;
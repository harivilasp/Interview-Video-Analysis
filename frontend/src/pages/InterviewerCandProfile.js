import React, { useState, useEffect } from 'react'
import Navbar, { linkList } from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useLocation } from 'react-router-dom'
import { getCandidateProfile, getTaskStatus, analizeCanadidateResume } from '../js/httpHandler'
import { formatRupee, useNotifier } from '../js/utils'

const InterviewerCandProfile = (props) => {

    const { state } = useLocation();
    const notifier = useNotifier();
    const { username, job_id, role } = (state && state.username) ? state : { username: '', job_id: '', role: '' }
    const [intervalRunning, setIntervalRunning] = useState(false);
    const [resumeAnalysisText, setResumeAnalysisText] = useState('');
    const isResumeUploaded = () => { return (userData.resume_location.constructor === String && userData.resume_location !== '') };


    const [userData, setUserData] = useState(
        {
            first_name: '',
            last_name: '',
            job: '',
            e_mail: '',
            phone: '+91 - ',
            about: '',
            experience: [],
            current_salary: '0',
            expected_salary: '0',
            resume_location: '',
            profile_image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
        })


    useEffect(() => {
        const fetchUserProfile = async () => {
            const profileData = await getCandidateProfile(notifier, username);
            if (profileData.constructor === Array && profileData.length === 0)
                return
            setUserData(profileData);
        };
        fetchUserProfile();
    }, []);

    const analizeResume = async () => {
        // Add Interval counter if not exists
        if (!intervalRunning) {
            const task_id = await analizeCanadidateResume(notifier, username, job_id);
            if (!task_id)
                {
                    console.error("Task couldn't be created.")
                    return
                }
            
            // Main intervel. Runs every 2 second to check for job status.
            const _intervalCounter = setInterval(async() => {
                setResumeAnalysisText('Analizing ...')
                const response = await getTaskStatus(notifier, task_id);

                if (!(response && response.status)){
                    console.error('No response status found')
                }
                else {
                    if (response.status == 'Success'){
                        setResumeAnalysisText(`By resume analysis, the candidate is ${response.result} % fit for your Job role.`);
                        setIntervalRunning(false);
                        clearInterval(_intervalCounter);
                    }
                    else if (response.status == 'Failed'){
                        console.error('Task failed in server');
                        setResumeAnalysisText('Some error occured in Server');
                        setIntervalRunning(false);
                        clearInterval(_intervalCounter);
                    }   
                }
            }, 1500);

            // Set Interval counter in state, so that click on button multiple times don't generate new counters,
            // if one counter is already running.
            console.warn('Interval counter started')
            setIntervalRunning(true)
        }
    }

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.INTERVIEWER_POSTS} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    {username} Profile</span>

                <div className='profile-container'>
                    <div className='profile-left-pane'>

                        <div className='profile-orverview'>

                            <div className='profile-image-container'>

                                <img className='profile-image' src={userData.profile_image} />
                            </div>

                            <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>{`${userData.first_name} ${userData.last_name}`}</span>
                            <span style={{ fontSize: '1.05rem' }}>{userData.job}</span>

                        </div>

                        <div className='personal-details'>

                            <div className='user-field'>
                                <div className='field-icon-container'>
                                    <div className='field-icon'>
                                        <b className='fa regular'>&#xf007;</b>
                                    </div>
                                </div>
                                <div className='field-details'>
                                    <div className='field-name'>First Name</div>
                                    <div className='field-value'>{userData.first_name}</div>
                                </div>
                            </div>


                            <div className='user-field'>
                                <div className='field-icon-container'>
                                    <div className='field-icon'>
                                        <b className='fa regular'>&#xf007;</b>
                                    </div>
                                </div>
                                <div className='field-details'>
                                    <div className='field-name'>Last Name</div>
                                    <div className='field-value'>{userData.last_name}</div>
                                </div>
                            </div>

                            <div className='user-field'>
                                <div className='field-icon-container'>
                                    <div className='field-icon'>
                                        <b className='fa regular'>&#x0040;</b>
                                    </div>
                                </div>
                                <div className='field-details'>
                                    <div className='field-name'>Email Address</div>
                                    <div className='field-value'>{userData.e_mail}</div>
                                </div>
                            </div>


                            <div className='user-field'>
                                <div className='field-icon-container'>
                                    <div className='field-icon'>
                                        <b className='fa regular'>&#xf095;</b>
                                    </div>
                                </div>
                                <div className='field-details'>
                                    <div className='field-name'>Phone Number</div>
                                    <div className='field-value'>{userData.phone}</div>
                                </div>
                            </div>


                            <div className='user-field'>
                                <div className='field-icon-container'>
                                    <div className='field-icon'>
                                        <b className='fa regular'>&#xf0b1;</b>
                                    </div>
                                </div>
                                <div className='field-details'>
                                    <div className='field-name'>Job</div>
                                    <div className='field-value'>{userData.job}</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='profile-middle-pane'>
                        <div className='about-title'>
                            About You
                        </div>

                        <div className='about-section'>
                            {userData.about}
                        </div>

                        <div className='about-title'>
                            Experience &amp; Education
                        </div>

                        <div className='experience-education'>
                            {
                                userData.experience.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {/* Dangerous HTML: https://reactjs.org/docs/dom-elements.html */}
                                            <span style={{ fontSize: '1.05rem', fontWeight: '600' }} dangerouslySetInnerHTML={{ '__html': item[0] }}></span><br />
                                            <span style={{ fontSize: '.95rem', color: '#000000AA' }}>{item[1]}</span>
                                        </div>)
                                })
                            }

                        </div>
                    </div>

                    <div className='profile-right-pane'>

                        <div className='about-title'>
                            Salary
                        </div>

                        <div className='experience-education'>
                            <div>
                                <span style={{ fontSize: '1.05rem', fontWeight: '600' }}> Current Salary</span><br />
                                <span style={{ fontSize: '.95rem', color: '#000000AA' }}> {formatRupee(userData.current_salary)} INR</span>
                            </div>

                            <div>
                                <span style={{ fontSize: '1.05rem', fontWeight: '600' }}> Expected Salary</span><br />
                                <span style={{ fontSize: '.95rem', color: '#000000AA' }}> {formatRupee(userData.expected_salary)} INR</span>
                            </div>
                        </div>


                        <div className='about-title'>
                            Resume
                        </div>

                        <ResumeDiv userData={userData} username={username} />
                    </div>

                </div>

                <div className='ai-action-section'>
                    <div style={{ fontSize: '1rem', color: '#2b2b2bda' }}>
                        <i>Analize candidate for:</i> <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{role}</span>
                    </div>

                    <div className='job-control-container' style={{ alignSelf: 'flex-start', width: '100%' }}>
                        {isResumeUploaded() && <button className='custom-blue' onClick={analizeResume}> Analize resume</button>}
                        {
                            (resumeAnalysisText) &&
                            <div className='resume-analysis-score'>
                                {resumeAnalysisText}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}




const ResumeDiv = (props) => {
    const { userData, username } = props;
    const isResumeUploaded = () => { return (userData.resume_location.constructor === String && userData.resume_location !== '') };

    return (
        <div className='resume-div'>
            <span style={{ fontSize: '1.05rem', fontWeight: '600', color: '#597DFCCC' }}>{(isResumeUploaded()) ? 'Resume.pdf' : 'No resume uploaded'}</span>
            {/* Make view resume when editable is false and resume is uploaded */}
            {
                isResumeUploaded() &&
                <>
                    <a style={{ color: 'inherit', textDecoration: 'inherit' }} href={`http://localhost:5000/getCandidateResume?candidate_username=${username}`} target="_blank">
                        <button className='custom-purple-reverse' style={{ marginTop: '15px', height: '35px' }}>View Resume</button></a>
                </>
            }
        </div >

    )
}


export default InterviewerCandProfile
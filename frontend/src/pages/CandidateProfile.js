import React, { useState, useEffect } from 'react'
import Footer from '../Components/Footer'
import Navbar, { linkList } from '../Components/Navbar'
import { getCandidateProfile, uploadCandidateResume } from '../js/httpHandler'
import { useFilePicker } from 'use-file-picker';
import { formatRupee, useNotifier } from '../js/utils';


// const profile_data = `I’m a software developer who has been working in the field for eight years. I’m passionate about creating quality products that meet all of the customer’s needs, and I love learning new techniques and technologies that allow me to make that happen.

// In 2012, I graduated from the University of Chicago with a degree in software development, and from there I went straight into an internship at Chicago Technologies. During the year I was there, I learned how to develop software at a professional level and got practice communicating with clients and estimating projects.

// After that, I started working at Illinois Software Company as a junior developer. A year into that job, I was promoted to senior developer, which meant I handled my own projects and checked the junior developers’ before they went to the client. I held that position until the company went under last month.`


const CandidateProfile = () => {

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
    const notifier = useNotifier();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const profileData = await getCandidateProfile(notifier);
            if (profileData.constructor === Array && profileData.length === 0)
                return
            setUserData(profileData);
        };
        fetchUserProfile();
    }, []);


    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.CANDIDATE_PROFILE} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    Your Profile
                </span>
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

                        <ResumeDiv userData={userData} updateUserData={setUserData} />
                    </div>

                </div>
            </div>


            <Footer />
        </div>
    )
}


const ResumeDiv = (props) => {
    const { userData, updateUserData } = props;
    const isResumeUploaded = () => { return (userData.resume_location.constructor === String && userData.resume_location !== '') };
    
    const [isEditable, setEditable] = useState(false);
    const [openFileSelector, { plainFiles }] = useFilePicker({
        accept: '.pdf',
    });
    const notifier = useNotifier();
    
    const saveResume = async () => {
        if (plainFiles.length !== 0) {
            const response = await uploadCandidateResume(notifier, plainFiles[0]);
            console.log(response)
            if (response) {
                updateUserData({ ...userData, resume_location: response });
                notifier('Resume updated successfully');
            }
        }
        setEditable(false);
    }
    return (
        <div className='resume-div'>
            <span style={{ fontSize: '1.05rem', fontWeight: '600', color: '#597DFCCC' }}>{(isResumeUploaded()) ? 'Resume.pdf': 'No resume uploaded'}</span>
            {/* Make view resume when editable is false and resume is uploaded */}
            {
                (isResumeUploaded() && (!isEditable)) &&
               
                    <a style={{ color: 'inherit', textDecoration: 'inherit' }} href='http://localhost:5000/getCandidateResume' target="_blank">
                         <button className='custom-purple-reverse' style={{ marginTop: '15px', height: '35px' }}>View Resume</button>
                    </a>
            }

            {/* Make upload resume option visible with save and cancel options */}
            {
                (isEditable) &&
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'stretch', width: '100%' }}>
                    <button className='custom-blue-reverse' style={{ marginTop: '10px', height: '30px' }} onClick={() => openFileSelector()}>
                        {
                            (isResumeUploaded) ? 'Upload New Resume' : 'Upload Resume'
                        }</button>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <button className='custom-blue-reverse' style={{ height: '30px', }} onClick={() => { setEditable(false) }}>Cancel</button>
                        <button className='custom-blue-reverse' style={{ height: '30px' }} onClick={saveResume} >Save</button>
                    </div>
                </div>
            }

            {/* Hide edit Icon when already in edit mode */}
            {
                (!isEditable) && <div className='edit-div' onClick={() => { setEditable(true) }}>
                    <span className='fa regular'>&#xf044;</span>
                </div>
            }

        </div >

    )
}


export default CandidateProfile
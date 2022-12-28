import React, { useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../Components/Footer'
import Navbar, { linkList } from '../Components/Navbar'
import { getJobData } from '../js/httpHandler'
import { useNotifier } from '../js/utils'

const CandidateJobDetails = () => {
    const { state } = useLocation();
    const notifier = useNotifier();
    const [jobData, setJobData] = useState(
        {
            "_id": "",
            "designation": "",
            "location": "",
            "experience": "",
            "industry": "",
            "employment_type": "",
            "skills": "",
            "salary": "",
            "education": "",
            "job_description": "",
            "lister": "",
        }
    );

    const getJobDetails = async (_id) => {
        const response = await getJobData(notifier, _id);
        if (response) {
            setJobData(response);
        }
    }

    useLayoutEffect(() => {
        if (state._id)
            getJobDetails(state._id);
    }, [])


    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.CANDIDATE_JOBS} />
            <div className='page-container'>
                <div className='job-details-container'>

                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Designation
                        </div>
                        <div className='job-details-content'>
                            {jobData.designation}
                        </div>
                    </div>


                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Company
                        </div>
                        <div className='job-details-content'>
                            {jobData.lister}
                        </div>
                    </div>


                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Location
                        </div>
                        <div className='job-details-content'>
                            {jobData.location}
                        </div>
                    </div>

                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Experience
                        </div>
                        <div className='job-details-content'>
                            {jobData.experience}
                        </div>
                    </div>

                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Industry
                        </div>
                        <div className='job-details-content'>
                            {jobData.industry}
                        </div>
                    </div>

                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Employment Type
                        </div>
                        <div className='job-details-content'>
                            {jobData.employment_type}
                        </div>
                    </div>

                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Skills
                        </div>
                        <div className='job-details-content'>
                            {jobData.skills}
                        </div>
                    </div>

                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Salary
                        </div>
                        <div className='job-details-content'>
                            {jobData.salary}
                        </div>
                    </div>

                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Education
                        </div>
                        <div className='job-details-content'>
                            {jobData.education}
                        </div>
                    </div>


                    <div className='job-details-div'>
                        <div style={{ color: '#1e1e1ecf' }}>
                            Job Description
                        </div>
                        <div className='job-details-content'>
                            {jobData.job_description}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CandidateJobDetails
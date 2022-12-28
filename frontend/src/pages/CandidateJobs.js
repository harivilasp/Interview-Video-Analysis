import React, { useState, useEffect } from 'react'
import Footer from '../Components/Footer'
import Navbar, { linkList } from '../Components/Navbar'
import { getCandidateJobs, applyJob, withdrawApplication } from '../js/httpHandler'
import { useNavigate } from 'react-router-dom'
import { formatRupee, useNotifier } from '../js/utils'

const CandidateJobs = () => {

    const [jobsList, updateJobsList] = useState([]);
    const navigate = useNavigate();
    const notifier = useNotifier();

    useEffect(() => {
        // Use effect renders twice
        // https://stackoverflow.com/a/60619061
        const fetchJobDetails = async () => {
            const jobData = await getCandidateJobs(notifier);
            updateJobsList(jobData);
        };
        fetchJobDetails();
    }, []);


    const applyForJob = async (job_id) => {
        const response = await applyJob(notifier, job_id);
        if (response.status) {
            // Reload page
            return navigate(0);
        }
    }

    const showJobDetails = (job_id) => {
        navigate('/candidateJobDetails', {state: { _id: job_id } })
    }

    const withdrawJobApplication = async (job_id) => {
        const response = await withdrawApplication(notifier, job_id);
        if (response.status) {
            // Reload page
            return navigate(0);
        }
    }

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.CANDIDATE_JOBS} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    Available Jobs for you</span>
                <div className='interview-list-container'>
                    {
                        jobsList.map((item, index) => {
                            return (
                                <div className='interview-item' key={index}>
                                    <div className='interview-details'>
                                        <div>Role:</div> <b>{item.designation}</b>
                                        <div>Company Name:</div><b>{item.lister}</b>
                                        <div>Salary:</div> <b>{formatRupee(item.salary)}</b>
                                        <div>Status:</div> <b>{(item.applied) ? 'Applied' : 'Not Applied'}</b>
                                    </div>
                                    {(!item.applied) && <button className='custom-purple' style={{ float: 'right', marginRight: '20px' }} onClick={() => { applyForJob(item._id) }}> Apply for Position</button>}
                                    {(item.applied) && <button className='custom-purple' style={{ float: 'right', marginRight: '20px' }} onClick={() => { withdrawJobApplication(item._id) }}> Withdraw Application</button>}
                                    {<button className='custom-blue-reverse' style={{ float: 'right', marginRight: '20px' }} onClick={() => { showJobDetails(item._id) }}> Show Job Details</button>}
                                </div>)
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default CandidateJobs
import React, { useState, useEffect } from 'react'
import Footer from '../Components/Footer';
import Navbar, { linkList } from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getInterviewerOpenings, scheduleCandidateInterview } from '../js/httpHandler';
import { formatRupee, useNotifier } from '../js/utils';

const InterviewerPosts = () => {
  const [openingList, updateOpeningList] = useState([]);
  const notifier = useNotifier();

  useEffect(() => {
    const fetchInterviewerJobList = async () => {
      const data = await getInterviewerOpenings(notifier);
      updateOpeningList(data);

    };
    fetchInterviewerJobList();
  }, []);

  return (
    <div className='page-wrapper'>
      <Navbar selectedPage={linkList.INTERVIEWER_POSTS} />
      <div className='page-container'>
        <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
          Posted Openings</span>
        <div className='interview-list-container'>
          {
            openingList.map((item, index) => {

              return (
                <OpeningItem key={index} role={item.designation} salary={item.salary} lister={item.lister}
                  location={item.location} applied={item.applied} job_id={item._id} />
              )
            })
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}


const OpeningItem = (props) => {
  const { role, salary, location, applied, job_id, lister } = props
  const [showCandidates, setShowCandidates] = useState(false);
  const navigate = useNavigate();
  const notifier = useNotifier();

  const showMoreDetails = () => {
    navigate('/postOpening', { state: {props: { '_id': job_id } }})
  }


  const scheduleInterview = async (candidate_username) => {

    const payload = {
      'time': parseInt(Date.parse(new Date) / 1000) + 18000,
      'job_id': job_id,
      'candidate': candidate_username,
      'designation': role,
      'location': location,
      'salary': salary,
      'lister': lister,
    }
    const response = await scheduleCandidateInterview(notifier, payload)
    if (response)
      notifier(response)

  }


  return (
    <div className='interview-item'>
      <div className='interview-details'>
        <div>Designation:</div> <b>{role}</b>
        <div>Location:</div> <b>{location}</b>
        <div>Salary:</div> <b>{formatRupee(salary)}</b>
        {
          showCandidates && applied.map((candidateName, index2) => {
            return (
              <React.Fragment key={index2}>
                <div>UserID:</div>
                <div style={{ margin: '5px 0px' }}>
                  {candidateName}
                  <button className='custom-purple-reverse' style={{ height: '30px', marginLeft: '10px' }} onClick={() => {
                    return navigate('/cand_profile', { state: { username: candidateName, job_id: job_id, role: role } });
                  }}> Show Candidate Profile</button>

                  <button className='custom-blue-reverse' style={{ height: '30px', marginLeft: '10px' }} onClick={() => { scheduleInterview(candidateName) }}
                  > Schedule Interview </button>

                </div>

              </React.Fragment>
            )
          })
        }
      </div>

      <button className='custom-blue-reverse' style={{ float: 'right', marginRight: '20px' }} onClick={showMoreDetails}> Show More Details</button>
      {<button className='custom-purple' style={{ float: 'right', marginRight: '20px' }} onClick={() => { setShowCandidates(!showCandidates) }}>
        {(showCandidates) ? 'Hide Applied Candidates' : 'Show Applied Candidates'}({applied.length})</button>}


    </div>)
}


export default InterviewerPosts
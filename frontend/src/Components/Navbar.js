import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { useIsMount, useLogout } from '../js/utils'
import store from '../redux/store'

const Navbar = (props) => {
    const [Username, setName] = useState('    ');
    const [pageLinks, updatePageLinks] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const signOutUser = useLogout();

    useEffect(() => {
        let { name, loggedIn, isInterviewer } = store.getState().mainReducer
        const accessLevel = (isInterviewer) ? 'INTERVIEWER' : 'CANDIDATE';
        setName(name);
        setLoggedIn(loggedIn);
        highlightSelectedPage(props.selectedPage, accessLevel, loggedIn)
    }, [])

    const highlightSelectedPage = (selectedPage, accessLevel, loggedIn) => {
        const pageLinkList = Object.values(linkList)
        // Fileter links with adming access if user doesn't have it.

        const finalLinkList = []

        for (let index = 0; index < pageLinkList.length; index++) {
            const pageDetails = pageLinkList[index];
            if ((pageDetails.access === 'ALL' || pageDetails.access == accessLevel) &&
                ((!pageDetails.loginRequired) || loggedIn)) {
                finalLinkList.push(
                    <Link className={`navbar-link${(index === selectedPage.index) ? ' selected' : ''}`} to={pageDetails.path} key={index}>{pageDetails.text}</Link>
                )
            }
        }

        updatePageLinks(finalLinkList);
    }
    
    return (
        <div style={{position:'relative', zIndex:5}}>
            <div className='navbar-custom'>
                <div className='navbar-logo' onClick={() => { navigate('/', { replace: true }) }}>
                    <span style={{ fontSize: '1.6rem', color: '#411D7A', fontWeight: "bold" }}>INTERVIEW.<span style={{ fontSize: '1rem', fontWeight: 'normal' }}> AI</span></span>
                </div>

                <div className='navbar-links-container' style={{ marginLeft: '50px' }}>
                    {pageLinks}
                </div>

                {loggedIn && <div className="dropdown">
                    <button className='navbar-user-button'>{Username}&nbsp;&nbsp;&#x2BC6;</button>
                    <div className="dropdown-content">
                        <button className='custom-purple-reverse' style={{ minWidth: '100%', borderColor: 'var(--background-light-color)' }} onClick={signOutUser}>Sign Out</button>
                    </div>
                </div>}
            </div>
            <AlertBar />
        </div>

    )
}

export const linkList = {
    'HOME': { index: 0, text: 'Home', path: '/', access: 'ALL', loginRequired: false },
    'CANDIDATE_JOBS': { index: 1, text: 'Jobs', path: '/jobs', access: 'CANDIDATE', loginRequired: true },
    'CANDIDATE_PROFILE': { index: 2, text: 'Profile', path: '/profile', access: 'CANDIDATE', loginRequired: true },
    'INTERVIEWER_POSTS': { index: 3, text: 'Posted Jobs', path: '/postedJobs', access: 'INTERVIEWER', loginRequired: true },
    'INTERVIEWER_NEW_OPENING': { index: 4, text: 'Openings', path: '/postOpening', access: 'INTERVIEWER', loginRequired: true }
}

Object.freeze(linkList)

const AlertBar = () => {
    const msgData = useSelector(state => state.notifierReducer);
    const firstMount = useIsMount();
    const [className, setClassName] = useState('notifier');

    useEffect(() => {
        if (!firstMount) {
            showMessage();
        }
    }, [msgData]);

    const showMessage = () => {
        setClassName('notifier show');
        setTimeout(() => {
            setClassName('notifier')
        }, 5000);
    };

    return (
        <div className={className}>
            <span>{msgData.message}</span>
        </div>
    )
};


export default Navbar
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { google_logo } from '../media/svg-icons'
import interview_image from '../media/graphics.png'
import Navbar, {linkList} from '../Components/Navbar'
import Footer from '../Components/Footer'
import {useNotifier} from '../js/utils'
import { loginUser } from '../js/httpHandler'



const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notifier = useNotifier();
    const userRef = useRef();
    const passRef = useRef();

    const login = () =>{
        const username = userRef.current.value;
        const password = passRef.current.value;
        const userDetails = {username: username, password: password};
        const candidate_cred = {username: 'hari_vilas', password: 'hari@123'};
        const company1_cred = {username: 'company1', password: 'comp1@123'};
        const company2_cred = {username: 'company2', password: 'comp2@123'};
        loginUser(notifier, candidate_cred, dispatch, navigate);
    }

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.HOME} />
            <div className='page-container'>
                <div className='login-container-div'>
                    <div className='login-div appear'>
                        <b style={{ fontSize: '1.7rem', marginBottom: '5px' }}>Login</b>

                        <span style={{ fontSize: '1rem', color: '#4D4D4D' }}>Doesn't have an account yet ? &nbsp;
                            <b><a href='/sign-up' style={{ color: '#893DFF' }}>Sign-Up</a></b></span><br />
                        
                        <form>
                            <div className='inp-container'>
                                <span className='inp-label'>Username </span>
                                <input className='custom-und' autoComplete='new-passoword' ref={userRef}></input>
                            </div>

                            <div className='inp-container'>
                                <span className='inp-label'>Password </span>
                                <input className='custom-und' autoComplete='new-password' type='password' ref={passRef}></input>
                            </div>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div className='login-button-container'>
                                <button className='custom-purple' style={{ flex: 1 }} onClick={login}>Login</button>
                            </div>
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 0 }}>
                                    <div style={{ height: '1px', flex: 1, backgroundColor: '#BDBDBD' }} />
                                    &nbsp;&nbsp;<span style={{ color: '#BDBDBD', fontSize: '.8rem' }}>or login with</span>&nbsp;&nbsp;
                                    <div style={{ height: '1px', flex: 1, backgroundColor: '#BDBDBD' }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', flex: '1', alignItems: 'center', justifyContent: 'center' }}>
                                    <button className='btn-google' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', felx: 1 }}>
                                        {google_logo} Google
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={interview_image} width="80%" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default LoginPage
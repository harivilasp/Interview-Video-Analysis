import React, {createContext} from 'react'
import { useDispatch } from 'react-redux';
import store from '../redux/store';
import { useNavigate, useLocation } from 'react-router-dom';

import { updateLogin } from '../redux/actions/actions';
import { useLogout } from '../js/utils';

const ProtectedRoutes = ({ children }) => {
    const { state } = useLocation();
    const MyContext = React.createContext(); 
    const dispatch = useDispatch();
    const signOutUser = useLogout();
    const { loggedIn } = store.getState().mainReducer;

    if (state && state.props) {
        children = React.cloneElement(children, state.props);
    }

    if (loggedIn) {
        return children;
    }
    // If user is logged in redirect to page

    // If redirect is disabled in state, show childrens.
    // Mostly used in case to show login pasge without verifying whether user has logged in or not.

    if (state && state.disableRedirect) {
        return children;
    }

    const isCookieAvailable = ((document.cookie.split('=').findIndex((item) => item === 'session')) !== -1)
    let usercred = localStorage.getItem('session');


    // Cookie not available, redirect to login page and disable further redirect.
    if (!(usercred && isCookieAvailable)) {
        signOutUser();
        return
    }

    // Cookie available use cookie to update redux.
    usercred = JSON.parse(usercred);
    dispatch(updateLogin(usercred));
    return children;
}
export default ProtectedRoutes
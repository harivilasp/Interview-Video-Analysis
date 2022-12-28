export const notify = (msg) =>{
    return {
        type: 'SET_MESSAGE',
        payload: msg,
    }
}

export const updateLogin = (data) =>{
    const payload = {username: data.username, isInterviewer: data.interviewer, loggedIn:true, name:data.name}
    return {
        type: 'UPDATE_USER_DETAILS',
        payload: payload,
    }
}

export const clearUserCred = () =>{
    const payload = {username:'', isInterviewer:false, name:'',loggedIn: false}
    return {
        type: 'UPDATE_USER_DETAILS',
        payload: payload,
    }  
}

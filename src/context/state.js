import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Notification } from 'rsuite';

const StateContext = React.createContext();
const UpdateStateContext = React.createContext();

export function useStateContext(){
    return useContext(StateContext);
}

export function useUpdateStateContext(){
    return useContext(UpdateStateContext);
}

export function StateProvider({children}) {
    const [userDetails, setUserDetails] = useState({
       username: '',
       profile_img: '',
       header_img: '',
       email: '',
       firstname: '',
       lastname: '',
       gender: '',
       createdat: ''
    });

    const [stateLoadingStatus, setStateLoadingStatus] = useState({
      stateLoading: true,
      refreshState: false
    })

    const [loginDetails, setLoginDetails] = useState({
        is_current_user_logged_in: false
    })

    const [inviteDetails, setInviteDetails] = useState({
        invited_user_email: '',
        organization_id: '',
        inviteKey: '',
        organization_name: '',
        organization_description: '',
        organization_image: '',
        isPrivate: '',
        is_verified: '',
        is_disabled: '',
    })

    const [allUserOrganization, setAllUserOrganization] = useState([]);

    const authTokenFromLocalStorage = JSON.parse(window.localStorage.getItem('auth-token'));
    useEffect(()=>{
        console.count('How many times is useeffect running')
       if(authTokenFromLocalStorage && !userDetails.id){
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokenFromLocalStorage}`;
        axios.get('/user')
        .then(function (response) {
          // handle success
          console.log(response);
          if(!loginDetails.is_current_user_logged_in){
              setLoginDetails({
                  is_current_user_logged_in: true
              })
          }

          setUserDetails(response.data.data[0])
          setStateLoadingStatus({stateLoading: false})
        })
        .catch(function (error) {
        //   if(error.message.indexOf('Network Error') !== -1){
        //     Notification['warning']({
        //       title: 'Network Error',
        //       description: 'Looks Like you are not connected to the internet'
        //     });
        // }else{
        //   Notification['warning']({
        //     title: 'Server Error',
        //     description: 'Something went wrong please reload'
        //   });
        // }
          // handle error
          console.log(error);
        })
      }else{
          setLoginDetails({
            is_current_user_logged_in: false
          })
          setStateLoadingStatus({stateLoading: false})
      }
    }, [authTokenFromLocalStorage])

    return (
       <StateContext.Provider value={[{stateLoadingStatus, userDetails, loginDetails, inviteDetails, allUserOrganization}]}>
         <UpdateStateContext.Provider value={[{setStateLoadingStatus, setUserDetails, setLoginDetails, setInviteDetails, setAllUserOrganization}]}>
            {children}
         </UpdateStateContext.Provider>
       </StateContext.Provider>
    )
}

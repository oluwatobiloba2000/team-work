import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';

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
      stateLoading: true
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
    const [currentWindowWidthState, setCurrentWindowWidth] = useState(0);

    const authTokenFromLocalStorage = JSON.parse(window.localStorage.getItem('auth-token'));
    

    function currentWindowWidth(e) {
      // width: 767
      setCurrentWindowWidth(window.innerWidth);
    }

    useEffect(()=>{

      setCurrentWindowWidth(window.innerWidth);
      window.addEventListener("resize", currentWindowWidth);

       if(authTokenFromLocalStorage && !userDetails.id){
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokenFromLocalStorage}`;
        axios.get('/user')
        .then(function (response) {
          console.log("🚀 ~ file: state.js ~ line 68 ~ response", response)
          // handle success
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
       return () => {
        window.removeEventListener("resize", currentWindowWidth);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authTokenFromLocalStorage])

    return (
       <StateContext.Provider value={[{currentWindowWidthState, stateLoadingStatus, userDetails, loginDetails, inviteDetails, allUserOrganization}]}>
         <UpdateStateContext.Provider value={[{setStateLoadingStatus, setUserDetails, setLoginDetails, setInviteDetails, setAllUserOrganization}]}>
            {children}
         </UpdateStateContext.Provider>
       </StateContext.Provider>
    )
}

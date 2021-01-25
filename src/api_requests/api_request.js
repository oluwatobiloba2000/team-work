import axios from 'axios';

const errorFormatter = (error) => {
    if (error && error.message && error.message.indexOf('403') !== -1) {
        return {
            error: true,
            authError: true,
            status: 'error',
            title: 'Authentication Error',
            description: 'You have to login'
        }
    } else if (error.message.indexOf('Network Error') !== -1) {
        return {
            error: true,
            authError: false,
            status: 'warning',
            title: 'Network Error',
            description: 'Looks Like you are not connected to the internet'
        }
    }
    return {
        error: true,
        authError: false,
        status: 'error',
        title: 'Server Error',
        description: 'Something went wrong',
        detailedError:  error.response ? error.response.data.message : null
    }

}


export async function checkToken(callBackFn) {
    const authTokenFromLocalStorage = JSON.parse(window.localStorage.getItem('auth-token'));
    if (!(callBackFn instanceof Function)) {
        return {
            error: true,
            decription: 'only functions can be passed as a callback'
        }
    }
    else if (authTokenFromLocalStorage) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokenFromLocalStorage}`;
        return await callBackFn();
    } else {
        return {
            error: true,
            authError: true,
            status: 'error',
            title: 'Authentication Error',
            description: 'You have to login'
        }
    }
}


export async function fetch_all_org_for_logged_in_user() {
    return axios.get('/user/org')
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function fetch_current_org_details(orgId) {
    return axios.get(`/org/${orgId}/details`)
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function fetch_all_post_for_current_channel(orgId, channelId) {
    return axios.get(`/org/${orgId}/feed/channel/${channelId}`)
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function fetch_channel_details_api(channelId) {
    return axios.get(`/channel/${channelId}`)
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function post_to_channel(orgId, channelId, post) {
    return axios.post(`/post/${orgId}/create/${channelId}`, {
        gif: post.gifurl,
        article : post.article,
        privacy: 'false'
    })
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function fetch_single_post(post_id) {
    return axios.get(`/post/${post_id}`)
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function fetch_comments(post_id) {
    return axios.get(`/comment/${post_id}/all`)
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function post_comment(post_id, comment) {
    return axios.post(`/comment/${post_id}/create/`, {
       comment
    })
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function create_channel(orgId, channel_name) {
    return axios.post(`/channel/${orgId}/create/`, {
       channelName: channel_name
    })
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function invite_user(orgId, email) {
    return axios.post(`/org/${orgId}/invite`, {
       email
    })
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}

export async function fetch_current_loggedin_user(userId) {
    return axios.get(`/user/${userId}`)
        .then(function (response) {
            return {
                error: false,
                data: response.data
            }
        })
        .catch(function (error) {
            return errorFormatter(error);
        });
}
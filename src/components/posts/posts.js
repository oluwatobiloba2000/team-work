import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, Dropdown, Icon, Loader, Notification } from 'rsuite';
import ViewPostAndComment from '../view_post/view_post_and_comment';
import './post.css';

dayjs.extend(relativeTime)

export default function Posts(props) {
    const { userAccount, currentOrgId } = props;
    const [gifPreview, setGifPreview] = useState();
    const [gifFile, setGifFile] = useState(null);
    const [article, setArticle] = useState();
    const [loading, setLoading] = useState(false);
    const [uploadPostLoading, setUploadPostLoading] = useState(false);
    // const [privacy, setPrivacy] = useState(false)
    const [posts, setPosts] = useState([])
    const { url } = useRouteMatch()

    useEffect(() => {
        fetchPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    const fetchPost = () => {
        const authTokenFromLocalStorage = JSON.parse(window.localStorage.getItem('auth-token'));

        if (authTokenFromLocalStorage) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authTokenFromLocalStorage}`;
            setLoading(true)


            axios.get(`/org/${currentOrgId}/feed`)
                .then(function (response) {
                   setTimeout(() => {
                        setLoading(false)

                    }, 2000)
                    // handle success
                    if (response.status === 200) {
                        // Notification['success']({
                        //     title: 'Success',
                        //     description: `Post Fe`
                        // });
                        return setPosts(response.data.data)
                    }
                })
                .catch(function (error) {
                    setLoading(false)
                    if (error.message.indexOf('403') !== -1) {
                        Notification['error']({
                            title: 'Authentication Error',
                            description: 'You have to login'
                        });
                        setTimeout(() => {
                            props.history.push('/auth/login')
                        }, 2000)
                    } else if (error.message.indexOf('Network Error') !== -1) {
                        Notification['warning']({
                            title: 'Network Error',
                            description: 'Looks Like you are not connected to the internet'
                        });
                    } else {
                        Notification['error']({
                            title: 'Task Error',
                            description: `${error.response.data.message}`
                        });
                    }
                });
        } else {
            Notification['error']({
                title: 'Authentication Error',
                description: 'You have to login'
            });
            setTimeout(() => {
                props.history.push('/auth/login')
            }, 2000)
        }
    }

    const handlePreviewGif = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            const reader = new FileReader();
            const file = e.target.files[0];
            if (file.size > 5000000) return Notification['error']({
                title: 'upload error',
                description: 'file too large'
            })
            reader.onloadend = () => {
                setGifPreview(reader.result);
                setGifFile(file)
            }

            reader.readAsDataURL(file)
        }
    }

    const handleUplaodGif = () => {
        setUploadPostLoading(true)
        if (!(gifFile || article)) {
            return Notification['error']({
                title: 'Post Error',
                description: 'Article or Gif Is required'
            })
        }

        const formData = new FormData();
        formData.append('gif', gifFile);

        axios.post('/gif/upload', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(function (response) {
               // handle success
                if (response.status === 200) {
                    // setOrgImg(response.data.data.secure_url)

                    Notification["success"]({
                        title: 'upload successful',
                        description: "Image has been uploaded"
                    })
                    setGifFile(null)
                    handlePost(response.data.data.secure_url)
                }
            })
            .catch(function (error) {
                setUploadPostLoading(false)
                if (error.message.indexOf('403') !== -1) {
                    Notification['error']({
                        title: 'Authentication Error',
                        description: 'You have to login'
                    });
                    setTimeout(() => {
                        props.history.push('/auth/login')
                    }, 2000)
                } else if (error.message.indexOf('Network Error') !== -1) {
                    Notification['warning']({
                        title: 'Network Error',
                        description: 'Looks Like you are not connected to the internet'
                    });
                } else {
                    Notification['warning']({
                        title: 'Server Error',
                        description: error.response.data.message
                    });
                }
            });
    }

    const handlePost = (gifurl) => {
        if (!gifFile) {
            axios.post(`/post/${currentOrgId}/create`, {
                gif: gifurl,
                article,
                privacy: 'false'
            })
                .then(function (response) {
                    setUploadPostLoading(false)
                    // handle success
                    if (response.status === 200) {
                        Notification['success']({
                            title: 'Success',
                            description: `Post Sent successfully`
                        });
                        resetForm()

                        return setPosts([response.data.data, ...posts]);
                    }
                })
                .catch(function (error) {
                    setUploadPostLoading(false)
                    if (error.message.indexOf('403') !== -1) {
                        Notification['error']({
                            title: 'Authentication Error',
                            description: 'You have to login'
                        });
                        setTimeout(() => {
                            props.history.push('/auth/login')
                        }, 2000)
                    } else if (error.message.indexOf('Network Error') !== -1) {
                        Notification['warning']({
                            title: 'Network Error',
                            description: 'Looks Like you are not connected to the internet'
                        });
                    } else {
                        Notification['error']({
                            title: 'Task Error',
                            description: `${error.response.data.message}`
                        });
                    }
                })
        } else {
            handleUplaodGif()
        }
    }

    const resetForm = () => {
        setGifPreview(null)
        setGifFile(null)
        setArticle('')
        document.getElementById('upload_gif_input').value = ''
    }

    const flagPostAsInAppropriate = (postId) =>{
        axios.post(`/post/${postId}/flag`)
            .then(function (response) {
                // handle success
                if (response.status === 200) {
                   return Notification['success']({
                        title: 'Success',
                        description: `Post flagged successfully`
                    });
                }
            })
            .catch(function (error) {
                if (error.message.indexOf('403') !== -1) {
                    Notification['error']({
                        title: 'Authentication Error',
                        description: 'You have to login'
                    });
                    setTimeout(() => {
                        props.history.push('/auth/login')
                    }, 2000)
                } else if (error.message.indexOf('Network Error') !== -1) {
                    Notification['warning']({
                        title: 'Network Error',
                        description: 'Looks Like you are not connected to the internet'
                    });
                } else {
                    Notification['error']({
                        title: 'Task Error',
                        description: `${error.response.data.message}`
                    });
                }
            })
    }

    return (
        <div className="first_section_container">
            <div className="first-widjet">
                <h2>Hello {userAccount.lastname},</h2>
                <h6>What's new with you? will you like to share something with the organization? 🤗</h6>
            </div>
            <div className="create_post_widjet">
                <p className="create_post_title">Create Post</p>
                <div className="create_post_input_container">
                    <img alt="chat" src="https://img.icons8.com/doodle/96/000000/chat.png" />
                    <textarea value={article} onChange={(e) => setArticle(e.target.value)} placeholder={`What's up ${userAccount.lastname}`}></textarea>
                    <div className="upload_and_submit">
                        <div className="gif_upload_container">
                            <img alt="upload gif" src="https://img.icons8.com/carbon-copy/48/000000/gif.png" />
                            <input id="upload_gif_input" onChange={(e) => handlePreviewGif(e)} type="file" />
                        </div>
                        {/* <Toggle size="lg" checkedChildren="Private" unCheckedChildren="Public" /> */}
                        <Button loading={uploadPostLoading} onClick={() => handlePost()}>
                            <img alt="publish post" src="https://img.icons8.com/fluent/48/000000/filled-sent.png" />
                                Publish
                        </Button>
                    </div>
                    {gifPreview && <div>
                            <img className="preview_gif" src={gifPreview} alt="gif preview"/>
                        {/* canceling gif preview */}
                        <Button appearance={'primary'} style={{ width: '100%' }} onClick={() => {
                            setGifPreview(null)
                            setGifFile(null)
                            document.getElementById('upload_gif_input').value = ''
                        }} >Cancel</Button>
                    </div>
                    }
                </div>
            </div>
            <div className="post_widjet">

                {loading
                    ? <div style={{ width: '100%', display: 'flex' }}> <Loader style={{ margin: 'auto' }} size="lg" /> </div>
                    : (posts && posts.length)
                        ?
                        posts.map((post, index) => {
                            return (
                                <div key={index} className="post">
                                    <div className="poster_details">
                                        <div className="poster_pics_and_name_container">
                                            {post.profile_img ? <img alt="avatar" src={post.profile_img} /> :
                                                <img alt="avatar" src={`https://ui-avatars.com/api/?name=${post.firstname} ${post.lastname}`} />}
                                            <div>
                                                <h5>{post.firstname} {post.lastname}  </h5>
                                                <div className="post_time_and_privacy">{dayjs(post.createdat).fromNow()} <div className="dot"></div> {post.privacy === 'false' ? 'public' : 'private'}</div>
                                            </div>
                                        </div>
                                        <div className="post_setting">
                                            <Dropdown
                                                renderTitle={() => {
                                                    return <Icon className="post_setting_icon" icon="ellipsis-v" />;
                                                }} placement="bottomEnd">
                                                {userAccount.id === post.user_id && <Dropdown.Item>
                                                    <Icon icon="edit2" /> Edit
                                                   </Dropdown.Item>
                                                }

                                                <Link to={`${url}?post=${post.post_id || post.id}`}>
                                                    <Dropdown.Item>
                                                        <Icon icon="eye" />
                                                        View
                                                    </Dropdown.Item>
                                                </Link>
                                                {
                                                    userAccount.id === post.user_id &&
                                                    <Dropdown.Item>
                                                        <Icon icon="trash" /> Delete
                                                    </Dropdown.Item>
                                                }
                                                {console.log({post})}
                                                {
                                                    userAccount.id === post.user_id ? <></>
                                                        : <Dropdown.Item onClick={() => flagPostAsInAppropriate(post.post_id)} style={{ color: 'red' }}>
                                                            <Icon icon="flag" /> Flag as Inappropriate
                                                           </Dropdown.Item>
                                                }
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="post_body">
                                        {post.article && <p>{post.article}</p>}
                                    </div>
                                    {post.gif &&
                                        <div className="post_gif_body">
                                            <img src="https://cdn.dribbble.com/users/14268/screenshots/3244702/flip-flop.gif " alt="gif" />
                                        </div>}
                                        <Link to={`${url}?post=${post.post_id || post.id}`}>
                                            <div className="comment_count_container">
                                                    <img style={{width: '24px', marginRight: '7px'}} src="https://img.icons8.com/doodle/48/000000/comments.png" alt="comment" />
                                                    <span className="comment_count">{post.comment_count || 0}</span> {post.comment_count === '0' && '- Be the first to comment'}
                                            </div>
                                        </Link>
                                </div>
                            )
                        })
                        :
                        <div style={{ textAlign: 'center', color: '#e6007e', padding: '19px' }}>
                            <h5>No Post Yet</h5>
                            <svg style={{ height: '158px', width: '200px' }} id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2" /><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56" /><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#fd9401" /><circle cx="190.15351" cy="24.95465" r="20" fill="#fd9401" /><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff" /><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6" /><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56" /><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#fd9401" /><circle cx="433.63626" cy="105.17383" r="20" fill="#fd9401" /><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff" /></svg>
                            {/* <img width="70%" alt="empty" src={emptySvg}/> */}
                        </div>
                }

            </div>
            {/* <Route path={`${url}/post/:id`} > */}
            <ViewPostAndComment currentOrgId={currentOrgId} props={props} />
            {/* </Route> */}
        </div>
    )
}

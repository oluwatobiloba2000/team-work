import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Badge, Content, Header, Icon, IconButton, Input, List, Placeholder, Notification, Tooltip, Whisper } from 'rsuite';
import { checkToken, fetch_all_post_for_current_channel, fetch_channel_details_api, post_to_channel } from '../../api_requests/api_request';
import { LetterAvatar } from '../../components/Avatar/avatar';
import './channel.css';
// import { io } from 'socket.io-client';
// import { socket } from '../../App';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function Channel(props) {
    let { orgId, org_members } = props;
    let [loading, setLoading] = useState(false);
    let { channelId } = useParams();
    const history = useHistory();
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0)
    const [channelDetails, setChannelDetails] = useState();
    let { url } = useRouteMatch();
    let [postArticle, setPostTextArea] = useState('');

    function renderNotification(response) {
        Notification[response.status]({
            title: response.title,
            description: response.detailedError
        })
        if (response.authError) {
            setTimeout(() => {
                history.push('/auth/login')
            }, 2000)
        }
    }

    const fetch_channel_posts = async () => {
        setLoading(true);

        const response = await checkToken(() => fetch_all_post_for_current_channel(orgId, channelId));

        if (response.error) {
            renderNotification(response);
            setLoading(false)
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        setPostCount(response.data.data.postCount.count)
        setPosts(response.data.data.posts);
    }

    const fetch_channel_details = async () => {
        const response = await checkToken(() => fetch_channel_details_api(channelId));

        if (response.error) {
            renderNotification(response);
        }
        setChannelDetails(response.data.data)
    }


    const handlePost = async () => {
        if (postArticle.length > 2) {
            // setLoading(true);
            const response = await checkToken(() => post_to_channel(orgId, channelId, {
                gifurl: null,
                article: postArticle,
            }));

            if (response.error) {
                return renderNotification(response);
            }
            setPostTextArea('')
            setPosts([response.data.data, ...posts])
            setPostCount(parseInt(postCount) + 1)
            // setLoading(false);
        }
    }

    useEffect(() => {
        fetch_channel_posts();
        fetch_channel_details();
        // socket.emit('join-channel', { channelId });
        // socket.on('posted-to-channel', (post) => {
        //     console.log(post);
        // })

        // return ()=>{
        //     socket.emit('leave-channel', channelId);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId])
    return (
        <>
            <Header className="org_header_container">
                <Helmet>
                    <title>{`#${channelDetails ? channelDetails.channel_name : 'Channel'}`} || Teamily</title>
                </Helmet>
                <div className="channel_title_header">
                    <div style={{ display: 'flex' }}>
                        <div className="channel_details">
                            <span>
                                <span className="channel_header_hash">#</span>
                                <div className="channel_header_name">{channelDetails && channelDetails.channel_name}</div>
                            </span>
                        </div>

                        <div className="header_members_count">
                            <Badge content={org_members}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </Badge>
                        </div>

                        <div className="post_count">
                            <Badge content={postCount}>
                                <svg style={{ width: '17px' }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                            </Badge>
                        </div>

                        {/* <div className="online_members_count">
                            <Badge style={{ background: '#4caf50', marginTop: '2px', marginRight: '4px' }} />
                            <span>{onlineMembers === 0 ? 'No members online' : onlineMembers === 1 ? '1 Member online' : `${onlineMembers} Members online`}</span>
                        </div> */}
                    </div>

                    <div className="search_and_options">
                        {/* <div className="search_container">
                            <input type="text" placeholder="search for posts" />
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div> */}
                        <Icon className="more_icon" icon="more" />
                    </div>
                </div>
            </Header>
            <Content className="post_body">
                <List className="post_list_container">
                    {loading ? <>
                        <Placeholder.Paragraph active style={{ marginTop: 30 }} graph="square" />
                        <Placeholder.Paragraph active style={{ marginTop: 30 }} graph="square" />
                        <Placeholder.Paragraph active style={{ marginTop: 30 }} graph="square" />
                        <Placeholder.Paragraph active style={{ marginTop: 30 }} graph="square" />
                        <Placeholder.Paragraph active style={{ marginTop: 30 }} graph="square" />
                    </>
                        : (posts && posts.length) ?
                            posts.map((singlePost, index) =>
                            (<List.Item className="post" key={index} index={index}>
                                <div className="poster_details">
                                    <LetterAvatar letter={`${singlePost.firstname} ${singlePost.lastname}`} />
                                    <Link to={`${url}?profile=${singlePost.user_id}`} className="username">{singlePost.firstname} {singlePost.lastname}</Link>

                                    <Whisper trigger="hover" placement="topStart" speaker={<Tooltip> {dayjs(singlePost.createdat).fromNow()} </Tooltip>}>
                                        <span className="time_posted">{dayjs(singlePost.createdat).format('D MMM YYYY [at] h[:]m a')}</span>
                                    </Whisper>
                                </div>
                                <div className="post_body_content">
                                    {singlePost.article}

                                    {singlePost.gifurl && <div className="post_pics">
                                        <img src="https://cdn.dribbble.com/users/2414448/screenshots/14602519/media/5c717de11024db08efba448ae411f220.png" alt="tobi" />
                                    </div>}

                                    <div className="thread">
                                        <Link to={`${url}?thread=${singlePost.id ? singlePost.id : singlePost.post_id}`}>
                                            {singlePost.comment_count === '0' ? 'Reply in thread' : <span>view thread <Badge content={singlePost.comment_count} /></span>}
                                        </Link>
                                    </div>
                                </div>
                            </List.Item>)
                            )
                            : <div style={{ marginBottom: '13px' }}>
                                {channelDetails && <>
                                    <h1>#{channelDetails.channel_name}</h1>
                                    <h4>#{channelDetails.channel_name} was created on {dayjs(channelDetails.createdat).format('MMMM D[,] YYYY')}. This is the very beginning of the #{channelDetails.channel_name} channel.</h4>
                                </>}
                            </div>
                        // <div style={{ height: '70%' }}>
                        //     <img style={{ marginTop: '30px' }} alt="channel chat" src={channelChatSvg} width="100%" height="50%" />
                        // </div>
                    }


                    <div className="post_input_container">
                        <Input componentClass="textarea" value={postArticle} onChange={(value) => setPostTextArea(value)} rows={3} style={{ resize: 'none', overflow: "hidden" }} placeholder={`message #${channelDetails && channelDetails.channel_name}`} />
                        <div className="input_toolbox">
                            <IconButton size="md" icon={<svg width="30px" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                            <IconButton size="md" onClick={() => handlePost()} icon={<Icon className="send_icon" icon="send" />} />
                        </div>
                    </div>
                </List>
            </Content>
        </>
    )
}

export default Channel;
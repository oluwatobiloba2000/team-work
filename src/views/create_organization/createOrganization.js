import React, { useEffect, useState } from 'react'
import './createOrganization.css';
import { Container, Header, Content, Sidebar, Placeholder, Whisper, Tooltip, ButtonToolbar, Button, InputPicker, Avatar, Icon, Notification, Loader, IconButton, Drawer } from 'rsuite';
import Logo from '../../components/logo/logo';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Schema } from 'rsuite';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useCurrentWindowWidth from '../../components/useCurrentWindowWidth/useCurrentWindowWidth';
import { Helmet } from 'react-helmet';
const { Paragraph } = Placeholder;

const images = [
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611523113/patternpad_rsioem.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611524535/patternpad_1_e9eak8.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611525049/patternpad_3_dwansm.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611525049/patternpad_4_brmlq7.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611525049/patternpad_5_dmip0u.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611525049/patternpad_6_hngtdk.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611525049/patternpad_2_b4zbgm.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611525049/patternpad_1_zlxjbn.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611524535/patternpad_1_e9eak8.svg",
    "https://res.cloudinary.com/oluwatobby/image/upload/v1611523378/undraw_Selecting_team_re_ndkb_oqt5fh.svg",
]

export default function CreateOrganization(props) {
    const { StringType } = Schema.Types;
    const model = Schema.Model({
        name: StringType()
            .isRequired('Name is required.')
            .minLength(4, "Name Length should more than 4 characters long")
            .maxLength(35, "Name should not exceed 35 characters"),
        description: (StringType()
            .isRequired('Description field is required.'))
            .maxLength(250, "Description should not exceed 250 characters, please keep it short"),
    });
    const [loading, setLoading] = useState({
        loading: false,
        message: ''
    });
    const [formValues, setFormValues] = useState({
        name: '',
        isPrivate: true,
        previewOrgImg: '',
        orgimgFile: '',
        description: '',
        headerImg: ''
    })

    const [currentWindowWidth] = useCurrentWindowWidth();
    const [openMobileDrawer, setOpenMobileDrawer] = useState(false);


    const createOrganization = (orgImg) => {
        axios.post('/org/create', {
            name: formValues.name,
            orgImg: orgImg,
            description: formValues.description,
            headerImg: formValues.headerImg,
            isPrivate: formValues.isPrivate
        })
            .then(function (response) {
                setLoading({ loading: false, message: '' });
                if (response.status === 200) {
                    Notification["success"]({
                        title: 'upload successful',
                        description: "organization created successfully"
                    })
                }
                setTimeout(() => {
                    props.history.push(`/organization/${response.data.data.organization[0].id}`)
                }, 2000)
            })
            .catch(function (error) {
                setLoading({ loading: false, message: '' })
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
                        description: 'Something went wrong'
                    });
                }
            });
    }

    const handleSubmit = (data) => {
        if (data) {
            // upload image
            setLoading({
                loading: true,
                message: 'Uploading Organization Image ....'
            })
            if (formValues.orgimgFile) {
                const formData = new FormData();
                formData.append('image', formValues.orgimgFile);

                axios.post('/upload', formData, {
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
                                description: "organization profile Image has been uploaded"
                            })
                            createOrganization(response.data.data.secure_url)
                        }
                    })
                    .catch(function (error) {
                        setLoading({ loading: false, message: '' })
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
                                description: 'Something went wrong'
                            });
                        }
                    });
            } else {
                createOrganization();
            }
        }
    }

    const returnRandomHeaderPics = () => {
        const randomNum = Math.floor(Math.random() * 10) + 1;
        return images[randomNum];
    }

    const handleUploadImage = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            const reader = new FileReader();
            const file = e.target.files[0]
            reader.onloadend = () => {
                setFormValues({
                    ...formValues,
                    orgimgFile: file,
                    previewOrgImg: reader.result
                });
            }

            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        const authTokenFromLocalStorage = JSON.parse(window.localStorage.getItem('auth-token'));
        if (authTokenFromLocalStorage) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authTokenFromLocalStorage}`;
            setFormValues({ ...formValues, headerImg: returnRandomHeaderPics() });
        } else {
            Notification['error']({
                title: 'Authentication Error',
                description: 'You have to login'
            });
            setTimeout(() => {
                props.history.push('/auth/login')
            }, 2000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function sideBarContent() {
        return (<>
            <div className="org_dash_name">
                <Helmet>
                    <title>create organization || Teamily</title>
                </Helmet>
                {formValues.name
                    ? <Whisper placement="top" trigger="hover" speaker={<Tooltip>{formValues.name}</Tooltip>}>
                        <p style={{ cursor: 'pointer' }}>{formValues.name}</p>
                    </Whisper>
                    : <Paragraph className="org_dash_name_loader" rows={1} />
                }
            </div>
            <div style={{ backgroundImage: `url(${formValues.headerImg})`, backgroundSize: "100% 100%" }} className="org_dash_panel_details">
                {formValues.previewOrgImg ? <Avatar className="org_profile_img org_profile_img_rounded" src={formValues.previewOrgImg} size="lg" />
                    :
                    <Paragraph className="org_profile_img" rows={0} style={{ marginTop: 30 }} graph="image" />}
                {formValues.isPrivate ? <Icon className="privacy_icon" icon="lock" /> : <Icon className="privacy_icon privacy_globe" icon="globe2" />}

            </div>

            <div className="org_dash_description">
                <p>Description</p>
                {formValues.description
                    ? <div className="org_dash_description_text">{formValues.description}</div>
                    :
                    <Paragraph className="org_dash_name_loader" rows={1} />
                }
            </div>
        </>)
    }

    return (
        <Container className="create_organization_container">
            {loading.loading && <Loader backdrop content={loading.message} vertical />}
            <Header className="header">
                <Logo className="org_logo" />
            </Header>
            <Container>
                {currentWindowWidth > 700
                    ?
                    <Sidebar className="org_sidebar">
                        {sideBarContent()}
                    </Sidebar>
                    :
                    <>
                        <IconButton className="mobile_nav_bar" onClick={() => setOpenMobileDrawer(true)} icon={<Icon icon="bars" />}> Preview Organization Details</IconButton>
                        <Drawer
                            size={'xs'}
                            placement={'left'}
                            show={openMobileDrawer}
                            className="mobile_drawer"
                            onHide={() => setOpenMobileDrawer(false)}>
                            {/* <Drawer.Header>
                                            <Drawer.Title>Drawer Title</Drawer.Title>
                                        </Drawer.Header> */}
                            <Drawer.Body>
                                {sideBarContent()}
                            </Drawer.Body>
                            <Drawer.Footer>
                                <Button style={{ width: '100%' }} onClick={() => setOpenMobileDrawer(false)} color="orange">Close</Button>
                            </Drawer.Footer>
                        </Drawer>
                    </>
                }
                <Content className="create_org_content org_content">
                    <Form onSubmit={handleSubmit} onChange={(values) => setFormValues({ ...formValues, name: values.name, description: values.description })} model={model} className="create_org_form" fluid>
                        <FormGroup>
                            <ControlLabel className="create_org_label">What's the name of your Organization?</ControlLabel>
                            <FormControl className="create_org_input" placeholder="Organization name" name="name" />
                            <HelpBlock>choose a descriptive name</HelpBlock>
                        </FormGroup>

                        <FormGroup style={{ marginTop: '130px' }}>
                            <ControlLabel className="create_org_label">Add more description about your Organization</ControlLabel>
                            <FormControl className="create_org_input" name="description" />
                        </FormGroup>

                        <FormGroup style={{ marginTop: '130px' }}>
                            <ControlLabel className="create_org_label">Add a profile image for your organization</ControlLabel>
                            <div className="uploader_container">
                                <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e) => handleUploadImage(e)} />
                            </div>
                            {/* <FormControl ref={uploaderImg} className="create_org_input" onChange={handleUploadImage} name="orgImg" type="file" /> */}
                        </FormGroup>

                        {/* <FormGroup style={{ marginTop: '130px' }}>
                            <ControlLabel className="create_org_label">Add an header image for your organization</ControlLabel>
                            <FormControl className="create_org_input" name="headerImg" type="file" />
                        </FormGroup> */}

                        <FormGroup style={{ marginTop: '130px' }}>
                            <ControlLabel className="create_org_label">Set Organization Privacy</ControlLabel>
                            <InputPicker defaultValue={true} className="create_org_input" onSelect={(val) => setFormValues({ ...formValues, isPrivate: val })} name="privacy" data={[{
                                value: true,
                                label: 'private',
                                groupBy: 'privacy'
                            }, {
                                value: false,
                                label: 'public',
                                groupBy: 'privacy'
                            },
                            ]} style={{ width: "100%" }} />
                        </FormGroup>

                        <FormGroup style={{ marginTop: '130px' }}>
                            <ButtonToolbar style={{ position: 'relative' }}>
                                <Button loading={loading.loading} className="create_org_form_btn" type="submit" appearance="primary">Create Organization</Button>
                                <Link style={{ zIndex: '10' }} to="/user/organization"><Button appearance="ghost">Cancel</Button></Link>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                </Content>
            </Container>
        </Container>
    )
}

import React from 'react';

// material-ui
import {
    Avatar,
    Stack,
    Typography,
    Grid,
    Button,
    Paper,
    TextField,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    Tooltip
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import { BarsOutlined } from '@ant-design/icons';
import EditIcon from '@mui/icons-material/Edit';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiBaseURL, domainURL, dynamicLinkSubDomain } from 'config';
import { apiKey } from 'Firebase/index';
import { useRef } from 'react';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

const Testimonials = () => {
    const url = apiBaseURL;

    const [open, setOpen] = React.useState(false);
    const [elevationValue, setelevationValue] = React.useState(0);
    const [elevationValue1, setelevationValue1] = React.useState(0);
    
    const [testimonials, settestimonials] = React.useState([]);
    const [formTitle, setformTitle] = React.useState('');
    const [formType, setformType] = React.useState(null);
    const [newTitle, setnewTitle] = React.useState(null);

    const [step, setstep] = React.useState(1);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setstep(1);
        setOpen(false);
        setformType(null);
        setelevationValue1(0);
        setelevationValue(0);
    };

    const moveStep = () => {
        if (step === 2) {
        } else {
            setstep(step + 1);
        }
    };

    const fetchData = () => {
        axios
            .get(`${url}/testimonial`)
            .then((res) => settestimonials(res.data))
            .catch((error) => console.log(error));
    };

    const updateTitle = async (formId) => {
        try {
            const res = await axios.patch(`${url}/testimonial`, {
                formId,
                newTitle
            });
            toast.success('Form Updated!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to Update', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        }
        fetchData();
    };

    const submitForm = async (e) => {
        e.target.disabled = true;
        const formId = `${Date.now()}-${uuidv4()}`;
        var formData = {
            userId: localStorage.getItem('userId'),
            userEmail: localStorage.getItem('userEmail'),
            formTitle,
            responses: 0,
            formType,
            formId,
            createdOn: new Date().toISOString()
        };
        // settestimonials([...testimonials, formData]);

        try {
            const res = await axios.post(`${url}/testimonial`, formData);
            // console.log(res.data)
            fetchData();
            toast.success('Form successfully created!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        } catch (error) {
            // console.log(error);
            toast.error('Error adding form, try again !', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        }

        setformTitle('');
        handleClose();
        setstep(1);
        e.target.disabled = true;

        // window.location.href = "/dashboard/testimonialview";
    };

    const deleteForm = async (formId) => {
        try {
            const res = await axios.delete(`${url}/testimonial/${formId}`);
            fetchData();
            toast.success('Form deleted successfully!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
            await axios.delete(`${url}/question/${formId}/None`).then((res) => console.log(res));
        } catch (error) {
            console.log(error);
            toast.error('Form deletion failed!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        }

        // handleClose();
        // window.location.href = "/dashboard/testimonialview";
    };

    const shortenLink = async (longLink) => {
        const longDynamicLink = `${dynamicLinkSubDomain}/?link=${longLink}`;
        // console.log(longDynamicLink);
        const res = await axios.post(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`, {
            longDynamicLink
        });
        return res.data.shortLink;
    };

    const copyToClipboard = async (url) => {
        const shorturl = await shortenLink(url);
        if (shorturl) {
            navigator.clipboard.writeText(shorturl);
            toast.success('Link Copied', {
                autoClose: 2000,
                position: 'top-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        } else {
            toast.warn('Error Occured !', {
                autoClose: 2000,
                position: 'top-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [testimonials]);

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth="sm"
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {step === 1 ? (
                        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                            <Grid item xs={6}>
                                <Paper
                                    sx={{ p: 5 }}
                                    elevation={elevationValue}
                                    onMouseEnter={() => {
                                        setelevationValue(3);
                                        setelevationValue1(0);
                                    }}
                                    onMouseLeave={() => {
                                        setelevationValue(0);
                                        setelevationValue1(0);
                                    }}
                                >
                                    <center>
                                        <Typography variant="h4">Multiple Questions</Typography>
                                        <br />
                                        <img
                                            style={{ width: '100%' }}
                                            alt="Questions"
                                            src="https://res.cloudinary.com/daboha8rt/image/upload/v1670678267/feedback/Completed-rafiki_mfgvf4.svg"
                                        />
                                        <br />
                                        <Button
                                            variant="text"
                                            fullWidth
                                            onClick={() => {
                                                setformType('multiple');
                                                moveStep();
                                            }}
                                            size="large"
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Continue
                                        </Button>
                                    </center>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper
                                    sx={{ p: 5 }}
                                    elevation={elevationValue1}
                                    onMouseEnter={() => {
                                        setelevationValue(0);
                                        setelevationValue1(3);
                                    }}
                                    onMouseLeave={() => {
                                        setelevationValue(0);
                                        setelevationValue1(0);
                                    }}
                                >
                                    <center>
                                        <Typography variant="h4">Single Questions</Typography>
                                        <br />
                                        <img
                                            style={{ width: '100%' }}
                                            alt="Questions"
                                            src="https://res.cloudinary.com/daboha8rt/image/upload/v1670678314/feedback/Taking_notes-pana_xltj58.svg"
                                        />
                                        <br />
                                        <Button
                                            variant="text"
                                            onClick={() => {
                                                setformType('single');
                                                moveStep();
                                            }}
                                            fullWidth
                                            size="large"
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Continue
                                        </Button>
                                    </center>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : step === 2 ? (
                        <>
                            <TextField
                                size="large"
                                value={formTitle}
                                onChange={(e) => setformTitle(e.target.value)}
                                fullWidth
                                variant="outlined"
                                label="Title"
                            />
                        </>
                    ) : null}
                </DialogContent>
                {step === 2 ? (
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button onClick={submitForm} autoFocus>
                            Submit
                        </Button>
                    </DialogActions>
                ) : null}
            </Dialog>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Typography sx={{ float: 'left' }} variant="h3">
                        Testimonials
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ float: 'right' }} onClick={handleClickOpen}>
                        Create new testimonial
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <List
                        component="nav"
                        sx={{
                            px: 0,
                            py: 0,
                            '& .MuiListItemButton-root': {
                                py: 1.5,
                                '& .MuiAvatar-root': avatarSX,
                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                            }
                        }}
                    >
                        {testimonials?.length === 0 ? (
                            <center>
                                <br />
                                <img
                                    style={{ width: '500px' }}
                                    alt="Add Form"
                                    src="https://res.cloudinary.com/daboha8rt/image/upload/v1672116377/feedback/Lo-fi_concept-rafiki_pacymm.svg"
                                />
                                <br />
                                <Button onClick={handleClickOpen} size="large">
                                    Start your first form
                                </Button>
                            </center>
                        ) : (
                            <>
                                {testimonials.map((item) => {
                                    return (
                                        <ListItemButton key={item.formId} divider>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        color: 'success.main',
                                                        bgcolor: 'success.lighter'
                                                    }}
                                                >
                                                    <BarsOutlined />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        id={`formTitle-${item?.formId}`}
                                                        variant="subtitle1"
                                                        onBlur={(e) => {
                                                            e.target.contentEditable = false;
                                                            updateTitle(item?.formId);
                                                        }}
                                                        onInput={(e) => {
                                                            setnewTitle(e.currentTarget.textContent);
                                                        }}
                                                    >
                                                        {item?.formTitle}{' '}
                                                    </Typography>
                                                }
                                                secondary={`${item?.responses} responses, ${new Date(item?.createdOn).toLocaleString()}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <Stack direction="row" spacing={2} alignItems="flex-end">
                                                    <Tooltip title="View More">
                                                        <Link to={`/dashboard/testimonialview/${item?.formId}`}>
                                                            <IconButton color="primary" aria-label="upload picture" component="label">
                                                                <RemoveRedEyeIcon />
                                                            </IconButton>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            color="info"
                                                            aria-label="upload picture"
                                                            component="label"
                                                            onClick={(e) => {
                                                                setnewTitle(item?.formTitle);
                                                                const title = document.querySelector(`#formTitle-${item?.formId}`);
                                                                title.contentEditable = true;
                                                                title.focus();
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Copy Link">
                                                        <IconButton
                                                            color="default"
                                                            aria-label="upload picture"
                                                            component="label"
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    `${domainURL}/viewform/${item?.formId}/${localStorage.getItem(
                                                                        'userId'
                                                                    )}`
                                                                )
                                                            }
                                                        >
                                                            <InsertLinkIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Form">
                                                        <IconButton
                                                            onClick={() => deleteForm(item?.formId)}
                                                            color="error"
                                                            aria-label="upload picture"
                                                            component="label"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                    );
                                })}
                            </>
                        )}
                    </List>
                </Grid>
            </Grid>
        </>
    );
};
export default Testimonials;

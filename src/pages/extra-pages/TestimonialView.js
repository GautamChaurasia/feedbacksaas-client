import React from 'react';

import {
    TextField,
    Drawer,
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Paper,
    Switch,
    Avatar,
    Stack,
    IconButton,
    Tooltip,
    Rating,
    Chip
} from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SquareIcon from '@mui/icons-material/Square';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useReactMediaRecorder } from 'react-media-recorder';
import Webcam from 'react-webcam';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router';
import axios from '../../../node_modules/axios/index';
import { apiBaseURL } from 'config';
import { set } from 'lodash';
import { string } from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// ==============================|| SAMPLE PAGE ||============================== //

const TestimonialView = () => {
    const [open, setOpen] = React.useState(false);
    const [elevationValue, setelevationValue] = React.useState(0);
    const [elevationValue1, setelevationValue1] = React.useState(0);
    const [elevationValue2, setelevationValue2] = React.useState(0);
    const [videourl, setVideourl] = React.useState('http://media.w3.org/2010/05/sintel/trailer.mp4');
    const [videostatus, setvideostatus] = React.useState(0);
    const [step, setstep] = React.useState(1);
    const [questions, setquestions] = React.useState([]);
    const [order, setOrder] = React.useState({});
    const [orderArray, setOrderArray] = React.useState([]);
    const [qnTitle, setNewQuestion] = React.useState('');
    const [questionTitle, setquestionTitle] = React.useState('');
    const [responses, setResponses] = React.useState([]);
    const [form, setForm] = React.useState(null);
    const { formId } = useParams();
    const url = apiBaseURL;

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: true });

    const fetchData = () => {
        axios
            .get(`${url}/question/${formId}/${localStorage.getItem('userId')}`)
            .then((res) => setquestions(res.data))
            .catch((error) => console.log(error));
    };

    const createQuestion = async (e, type) => {
        e.target.disabled = true;
        const qnId = `${Date.now()}-${uuidv4()}`;
        var formData = {
            formId,
            userId: localStorage.getItem('userId'),
            qnTitle: questionTitle,
            responses: 0,
            qnType: type,
            qnId,
            createdOn: new Date().toISOString()
        };

        try {
            const res = await axios.post(`${url}/question`, formData);
            // console.log(res.data)
            fetchData();
            toast.success('Question successfully created!', {
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
            toast.error('Error adding question, try again !', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        }

        handleClose();
        setquestionTitle('');
        setstep(1);
        e.target.disabled = false;
    };

    const updateQuestion = async (qnId, params) => {
        const payload = { params };
        payload.formId = formId;
        payload.qnId = qnId;
        // console.log(payload)
        const res = await axios.patch(`${url}/question`, payload);
        if (res.data !== '') {
            toast.error('Some Error Occurred', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        } else {
            fetchData();
            toast.info('Question updated !', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            });
        }
    };

    const deleteQuestion = async (qnId) => {
        const res = await axios.get(`${url}/question/${qnId}`);
        const videoKey = res.data.videoKey;
        axios
            .delete(`${url}/question/${formId}/${qnId}`, { data: { videoKey } })
            .then((res) => {
                updateOrder(null, qnId);
                toast.info('Question successfully deleted!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            })
            .catch((error) => {
                console.log(error);
                toast.error('Deletion Failed', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            });
        handleClose();
        // window.location.href = "/dashboard/testimonialview";
    };

    const updateOrder = (dragEvent, qnId) => {
        const tempList = orderArray;
        if (dragEvent) {
            const source = dragEvent.source;
            const dest = dragEvent.destination;
            if (!dest) return;
            const [removed] = tempList.splice(source.index, 1);
            tempList.splice(dest.index, 0, removed);
        } else {
            tempList.splice(order[qnId], 1);
        }

        const tempOrder = {};
        tempList.map((key, index) => {
            tempOrder[key] = index;
        });
        setOrder(tempOrder);
    };

    const handleClickOpen = () => {
        setstep(1);
        setvideostatus(0);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setelevationValue1(0);
        setelevationValue(0);
    };
    const moveStep = () => {
        if (step === 2) {
        } else {
            setstep(step + 1);
        }
    };

    const changeVideoStatus = (status) => {
        if (status === 1) {
            startRecording();
            setvideostatus(2);
        } else if (status === 2) {
            stopRecording();
            setvideostatus(0);
            setstep(3);
        }
    };

    const convertBlobToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () =>
                resolve({
                    base64: reader.result
                });
            reader.onerror = reject;
        });

    const createVideoQuestion = async (e) => {
        e.target.disabled = true;
        const qnId = `${Date.now()}-${uuidv4()}`;
        const video = await fetch(mediaBlobUrl);
        const videoBlob = await video.blob();
        let video64 = await convertBlobToBase64(videoBlob);
        video64 = video64.base64;

        var formData = {
            formId,
            userId: localStorage.getItem('userId'),
            qnTitle: 'N.A.',
            responses: 0,
            qnType: 'video',
            qnId,
            video64,
            createdOn: new Date().toISOString()
        };

        const res = await axios.post(`${url}/question/video`, formData);
        fetchData();
        console.log(res);

        handleClose();
        e.target.disabled = false;
    };

    const [value, setValue] = React.useState('Questions');
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        console.log(anchor);
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    React.useEffect(() => {
        axios
            .get(`${url}/testimonial/${formId}`)
            .then((res) => setForm(res.data))
            .catch((error) => console.log(error));
        fetchData();
    }, []);

    React.useEffect(() => {
        const tempOrderArray = [];
        questions.forEach(({ qnId }) => {
            tempOrderArray.push(qnId);
        });
        setOrderArray(tempOrderArray);
    }, [questions]);

    React.useEffect(() => {
        // console.log(order)
        axios
            .patch(`${url}/question/reorder`, { order })
            .then((res) => {
                fetchData();
            })
            .catch((error) => {
                console.log(error);
            });
    }, [order]);

    React.useEffect(() => {
        axios.get(`${url}/response/${formId}?count=false`).then((res) => {
            setResponses(res.data);
        });
    }, []);

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        padding: 1,
        borderRadius: '5px',
        background: isDragging ? '#deebff' : 'rgb(250, 250, 251)',
        ...draggableStyle
    });

    // const list = (anchor) => (
    //     <Box sx={{ width: 500, p: 2 }} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
    //         <br />
    //         <br />
    //         <br />
    //         <Card variant="outlined" sx={{ mb: 2 }}>
    //             <CardContent>
    //                 <Chip sx={{ float: 'right' }} color="success" label="Public" />
    //                 <Stack sx={{ mb: 2 }} direction="row" spacing={1}>
    //                     <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
    //                     <Typography sx={{ pt: 1 }} variant="h5">
    //                         Test User
    //                     </Typography>
    //                 </Stack>
    //                 <Rating name="read-only" value={5} readOnly />
    //                 <br />
    //                 <Typography variant="p">
    //                     I just learned about test.com this morning and now they have a new customer. I'm head over heels about Test's
    //                     project. It just works! Well done!
    //                 </Typography>
    //             </CardContent>
    //         </Card>
    //     </Box>
    // );

    return (
        <>
            <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
                <Box
                    sx={{ width: 500, p: 2 }}
                    role="presentation"
                    onClick={toggleDrawer('right', false)}
                    onKeyDown={toggleDrawer('right', false)}
                >
                    <br />
                    <br />
                    <br />
                    <Typography variant="h5" component="div">
                        Q. Tell us more about the user expirience of the product ?
                    </Typography>
                    <br />

                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Chip sx={{ float: 'right' }} color="success" label="Public" />
                            <Stack sx={{ mb: 2 }} direction="row" spacing={1}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                <Typography sx={{ pt: 1 }} variant="h5">
                                    Test User
                                </Typography>
                            </Stack>
                            <Rating name="read-only" value={5} readOnly />
                            <br />
                            <Typography variant="p">
                                I just learned about test.com this morning and now they have a new customer. I'm head over heels about
                                Test's project. It just works! Well done!
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Chip sx={{ float: 'right' }} color="success" label="Public" />
                            <Stack sx={{ mb: 2 }} direction="row" spacing={1}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                <Typography sx={{ pt: 1 }} variant="h5">
                                    Test User
                                </Typography>
                            </Stack>
                            <Rating name="read-only" value={5} readOnly />
                            <br />
                            <Button
                                variant="text"
                                endIcon={<PlayCircleIcon />}
                                onClick={() => {
                                    setstep(4);
                                    setOpen(true);
                                }}
                            >
                                Play Video
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Drawer>

            <Dialog
                open={open}
                fullWidth
                maxWidth={step == 1 ? 'md' : 'sm'}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {step === 1 ? (
                        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                            <Grid item xs={4}>
                                <Paper
                                    sx={{ p: 5 }}
                                    elevation={elevationValue}
                                    onMouseEnter={() => {
                                        setelevationValue(3);
                                        setelevationValue1(0);
                                        setelevationValue2(0);
                                    }}
                                    onMouseLeave={() => {
                                        setelevationValue(0);
                                        setelevationValue1(0);
                                        setelevationValue2(0);
                                    }}
                                >
                                    <center>
                                        <Typography variant="h4">Video Questions</Typography>
                                        <br />
                                        <img
                                            style={{ width: '100%' }}
                                            alt="Questions"
                                            src="https://res.cloudinary.com/daboha8rt/image/upload/v1670679853/feedback/Video_tutorial-rafiki_uq52yz.svg"
                                        />
                                        <br />
                                        <Button variant="text" fullWidth onClick={moveStep} size="large" endIcon={<ArrowForwardIcon />}>
                                            Select
                                        </Button>
                                    </center>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper
                                    sx={{ p: 5 }}
                                    elevation={elevationValue1}
                                    onMouseEnter={() => {
                                        setelevationValue(0);
                                        setelevationValue1(3);
                                        setelevationValue2(0);
                                    }}
                                    onMouseLeave={() => {
                                        setelevationValue(0);
                                        setelevationValue1(0);
                                        setelevationValue2(0);
                                    }}
                                >
                                    <center>
                                        <Typography variant="h4">Text Questions</Typography>
                                        <br />
                                        <img
                                            style={{ width: '100%' }}
                                            alt="Questions"
                                            src="https://res.cloudinary.com/daboha8rt/image/upload/v1670679880/feedback/Creative_writing-amico_fcahqy.svg"
                                        />
                                        <br />
                                        <Button
                                            variant="text"
                                            onClick={() => setstep(5)}
                                            fullWidth
                                            size="large"
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Select
                                        </Button>
                                    </center>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper
                                    sx={{ p: 5 }}
                                    elevation={elevationValue2}
                                    onMouseEnter={() => {
                                        setelevationValue(0);
                                        setelevationValue1(0);
                                        setelevationValue2(3);
                                    }}
                                    onMouseLeave={() => {
                                        setelevationValue(0);
                                        setelevationValue1(0);
                                        setelevationValue2(0);
                                    }}
                                >
                                    <center>
                                        <Typography variant="h4">Rating Questions</Typography>
                                        <br />
                                        <img
                                            style={{ width: '100%' }}
                                            alt="Questions"
                                            src="https://res.cloudinary.com/daboha8rt/image/upload/v1670679853/feedback/Video_tutorial-rafiki_uq52yz.svg"
                                        />
                                        <br />
                                        <Button
                                            variant="text"
                                            fullWidth
                                            onClick={() => setstep(6)}
                                            size="large"
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Select
                                        </Button>
                                    </center>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : step === 2 ? (
                        <center style={{ marginTop: '22px' }}>
                            <Webcam />
                            <Stack sx={{ mt: 2 }} direction="row" spacing={2} justifyContent="center">
                                {videostatus === 0 ? (
                                    <Tooltip title="Start Video Recording">
                                        <IconButton
                                            size="large"
                                            onClick={() => changeVideoStatus(1)}
                                            color="primary"
                                            aria-label="add to shopping cart"
                                        >
                                            <FiberManualRecordIcon />
                                        </IconButton>
                                    </Tooltip>
                                ) : videostatus === 2 ? (
                                    <Tooltip title="Stop Video Recording">
                                        <IconButton
                                            color="error"
                                            size="large"
                                            onClick={() => changeVideoStatus(2)}
                                            aria-label="add to shopping cart"
                                        >
                                            <SquareIcon />
                                        </IconButton>
                                    </Tooltip>
                                ) : null}
                            </Stack>
                            {/* <div>
                                        <button onClick={startRecording}>Start Recording</button>
                                        <button onClick={stopRecording}>Stop Recording</button>
                                    </div> */}
                        </center>
                    ) : step === 3 ? (
                        <center style={{ marginTop: '20px' }}>
                            <video src={mediaBlobUrl} controls autoPlay loop />
                        </center>
                    ) : step === 4 ? (
                        <>
                            <center style={{ marginTop: '20px' }}>
                                <video width="100%" src={videourl} controls autoPlay loop />
                            </center>
                        </>
                    ) : step === 5 ? (
                        <>
                            <TextField
                                size="large"
                                value={questionTitle}
                                onChange={(e) => setquestionTitle(e.target.value)}
                                fullWidth
                                variant="outlined"
                                label="Question"
                            />
                        </>
                    ) : step === 6 ? (
                        <>
                            <TextField
                                size="large"
                                value={questionTitle}
                                onChange={(e) => setquestionTitle(e.target.value)}
                                fullWidth
                                variant="outlined"
                                label="Question"
                            />
                        </>
                    ) : null}
                </DialogContent>
                {step === 3 ? (
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button onClick={() => setstep(2)} autoFocus>
                            Retake
                        </Button>
                        <Button onClick={createVideoQuestion} autoFocus>
                            Submit
                        </Button>
                    </DialogActions>
                ) : null}

                {step === 5 ? (
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button onClick={(e) => createQuestion(e, 'text')} autoFocus>
                            Submit
                        </Button>
                    </DialogActions>
                ) : null}

                {step === 6 ? (
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button onClick={(e) => createQuestion(e, 'rate')} autoFocus>
                            Submit
                        </Button>
                    </DialogActions>
                ) : null}
            </Dialog>

            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Typography sx={{ float: 'left' }} variant="h3">
                        {form?.formTitle}
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ float: 'right' }} onClick={handleClickOpen}>
                        Create questions
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="Questions" control={<Radio />} label="Questions" />
                            <FormControlLabel value="Testimonial" control={<Radio />} label="Testimonial" />
                        </RadioGroup>
                    </FormControl>

                    {value === 'Questions' ? (
                        <>
                            {questions?.length === 0 ? (
                                <center>
                                    <br />
                                    <img
                                        style={{ width: '500px' }}
                                        alt="Create Question"
                                        src="https://res.cloudinary.com/daboha8rt/image/upload/v1672373486/feedback/Lo-fi_concept-amico_n8hspj.svg"
                                    />
                                    <br />
                                    <Button onClick={handleClickOpen} size="large">
                                        Create your first question
                                    </Button>
                                </center>
                            ) : (
                                <DragDropContext onDragEnd={updateOrder}>
                                    <Droppable droppableId="form-questions">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {questions?.map((item, index) => {
                                                    return (
                                                        <Draggable key={item?.qnId} draggableId={item?.qnId} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}
                                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                                >
                                                                    <Card sx={{ mb: 2 }}>
                                                                        <CardContent>
                                                                            <Switch
                                                                                sx={{ float: 'right' }}
                                                                                label="enable"
                                                                                checked={item?.qnState}
                                                                                onChange={() =>
                                                                                    updateQuestion(item.qnId, { qnState: !item.qnState })
                                                                                }
                                                                            />

                                                                            <Typography variant="h5" component="div">
                                                                                Question {item?.index + 1}
                                                                                <br />
                                                                                {item?.qnType === 'text' || item.qnType === 'rate' ? (
                                                                                    <div
                                                                                        style={{ width: '60%' }}
                                                                                        id={item?.qnId}
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === 'Enter' && e.ctrlKey) {
                                                                                                e.target.blur();
                                                                                            }
                                                                                        }}
                                                                                        onInput={(e) =>
                                                                                            setNewQuestion(e.currentTarget.textContent)
                                                                                        }
                                                                                        onBlur={(e) => {
                                                                                            e.target.contentEditable = false;
                                                                                            updateQuestion(item.qnId, { qnTitle: qnTitle });
                                                                                        }}
                                                                                    >
                                                                                        {item.qnTitle}
                                                                                    </div>
                                                                                ) : (
                                                                                    <br />
                                                                                )}
                                                                            </Typography>

                                                                            {item.qnType === 'video' ? (
                                                                                <Button
                                                                                    variant="text"
                                                                                    endIcon={<PlayCircleIcon />}
                                                                                    onClick={() => {
                                                                                        // setVideourl(item?.videoURL)
                                                                                        setstep(4);
                                                                                        setOpen(true);
                                                                                    }}
                                                                                >
                                                                                    Play Video
                                                                                </Button>
                                                                            ) : null}

                                                                            <Tooltip title="Delete Question">
                                                                                <IconButton
                                                                                    onClick={() => deleteQuestion(item?.qnId)}
                                                                                    sx={{ float: 'right', m: 1 }}
                                                                                    color="error"
                                                                                    aria-label="upload picture"
                                                                                    component="label"
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </Tooltip>

                                                                            <Tooltip title="View Responses">
                                                                                <IconButton
                                                                                    onClick={toggleDrawer('right', true)}
                                                                                    sx={{ float: 'right', m: 1 }}
                                                                                    color="default"
                                                                                    aria-label="upload picture"
                                                                                    component="label"
                                                                                >
                                                                                    <RemoveRedEyeIcon />
                                                                                </IconButton>
                                                                            </Tooltip>

                                                                            <Tooltip title="Edit Question">
                                                                                <IconButton
                                                                                    sx={{ float: 'right', m: 1 }}
                                                                                    color="primary"
                                                                                    aria-label="upload picture"
                                                                                    component="label"
                                                                                    onClick={() => {
                                                                                        setNewQuestion(item?.qnTitle);
                                                                                        const question = document.getElementById(
                                                                                            `${item?.qnId}`
                                                                                        );
                                                                                        question.contentEditable = true;
                                                                                        question.focus();
                                                                                    }}
                                                                                >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
                        </>
                    ) : (
                        <TableContainer component={Paper}>
                            {responses.length !== 0 ? (
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: '30px' }}>Person</TableCell>
                                            <TableCell sx={{ width: '40px' }} align="left">
                                                Testimonial
                                            </TableCell>
                                            <TableCell sx={{ width: '60px' }} align="left">
                                                Date
                                            </TableCell>
                                            <TableCell sx={{ width: '60px' }} align="center">
                                                Status
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {responses.map((item) => {
                                            let date = new Date(item.createdOn).toString();
                                            date = date.split(' ');
                                            date = date.slice(0, 4).join(' ');
                                            const keys = Object.keys(item.answers);
                                            let qnCount = 1;
                                            const responseList = keys.map((key) => {
                                                const videoPattern = /^https:\/\//;
                                                const isVideo = videoPattern.test(item.answers[key]);
                                                const ratePattern = /^rate-/;
                                                const isRate = ratePattern.test(item.answers[key]);
                                                return (
                                                    <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">
                                                            <Stack direction="row" spacing={1}>
                                                                <Avatar alt="Reviewer" src="/static/images/avatar/1.jpg" />
                                                                <Typography sx={{ pt: 1 }} variant="h5">
                                                                    {item.reviewer.name}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {/* <Rating name="read-only" value={item.rating} readOnly /> */}
                                                            <br />

                                                            {isVideo ? (
                                                                <>
                                                                    <Typography sx={{ color: 'gray' }} variant="subtitle2">
                                                                        Question {qnCount++}.
                                                                    </Typography>
                                                                    <Button
                                                                        variant="text"
                                                                        endIcon={<PlayCircleIcon />}
                                                                        onClick={() => {
                                                                            // setVideourl(item.answers[key])
                                                                            setstep(4);
                                                                            setOpen(true);
                                                                        }}
                                                                    >
                                                                        Play Video
                                                                    </Button>
                                                                </>
                                                            ) : isRate ? (
                                                                <>
                                                                    <Typography sx={{ color: 'gray' }} variant="subtitle2">
                                                                        Question {qnCount++}.
                                                                    </Typography>
                                                                    <Rating
                                                                        name="read-only"
                                                                        value={parseInt(item.answers[key].split('-')[1])}
                                                                        readOnly
                                                                    />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Typography sx={{ color: 'gray' }} variant="subtitle2">
                                                                        Question {qnCount++}.
                                                                    </Typography>
                                                                    <Typography sx={{ pt: 1 }} variant="p">
                                                                        {item.answers[key]}
                                                                    </Typography>
                                                                </>
                                                            )}
                                                        </TableCell>

                                                        <TableCell align="left">
                                                            <Typography sx={{ pt: 1 }} variant="p">
                                                                {date}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Chip color="success" label="Public" />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            });
                                            return responseList;
                                        })}
                                    </TableBody>
                                </Table>
                            ) : (
                                <center>
                                    <Typography variant="h5">No responses registered yet !</Typography>
                                </center>
                            )}
                        </TableContainer>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default TestimonialView;

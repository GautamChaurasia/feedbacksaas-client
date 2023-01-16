import React from 'react';
import ReactConfetti from 'react-confetti';

// material-ui
import { Typography, Stack, Container, Rating, TextField, Card, CardContent, Button, Avatar } from '@mui/material';
import Webcam from 'react-webcam';
import { useReactMediaRecorder } from 'react-media-recorder';
import { v4 as uuidv4, validate } from 'uuid';
import { Dialog, DialogContent } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import { useParams } from 'react-router';
import axios from 'axios';
import { apiBaseURL } from 'config';
import { Input } from '../../../node_modules/@mui/icons-material/index';
import { useRef } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => {
    const [rating, setrating] = React.useState(null);
    const [step1, setstep1] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const [dispVideo, setDispVideo] = React.useState(false);
    const [valid, setValid] = React.useState(false); //to validate user input
    const [prevStat, setPrevStat] = React.useState(false); //for prev Button
    const [formData, setFormData] = React.useState(null);
    const [questionCount, setQuestionCount] = React.useState(0);
    const [textAnswers, setTextAnswers] = React.useState({});
    const [videoAnswers, setVideoAnswers] = React.useState({});
    const [reviewer, setReviewer] = React.useState({});
    const [avatar, setAvatar] = React.useState(null);
    const [videourl, setVideourl] = React.useState('http://media.w3.org/2010/05/sintel/trailer.mp4');
    const [windoDimention, setwindoDimention] = React.useState({ width: window.innerWidth, height: window.innerHeight });
    const uploadInputRef = useRef();
    const { formId, userId } = useParams();

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: true });

    const validateInput = (e) => {
        if (step1 === 4) {
            if (Object.keys(reviewer).length === 4) {
                setValid(true);
            }
            return;
        }
        let inp = e.target.value;
        inp = inp.trim();
        if (inp.length) {
            setValid(true);
        } else {
            setValid(false);
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

    const handleRecording = async (e, flag) => {
        if (flag) {
            setDispVideo(false);
            startRecording();
            setValid(true);
        } else {
            stopRecording();
            setDispVideo(true);
        }
    };

    const handleAnswers = (e, qnId) => {
        setTextAnswers((prev) => {
            let id, value;
            if (qnId) {
                id = qnId;
                value = `rate-${e.target.value}`;
            } else {
                id = e.target.id;
                value = e.target.value;
            }

            return { ...prev, [id]: `${value}` };
        });
    };

    const handleVideoAnswer = async (qnId) => {
        const video = await fetch(mediaBlobUrl);
        const videoBlob = await video.blob();
        let video64 = await convertBlobToBase64(videoBlob);
        video64 = video64.base64;
        setVideoAnswers((prev) => {
            return { ...prev, [qnId]: video64 };
        });
    };

    const handleReviewer = (e) => {
        if (!e.target.value.length) {
            setReviewer((reviewer) => {
                const temp = { ...reviewer };
                delete temp[e.target.id];
                return temp;
            });
            setValid(false);
            return;
        }
        setReviewer((reviewer) => {
            return { ...reviewer, [e.target.id]: e.target.value };
        });
    };

    const detectSize = () => {
        setwindoDimention({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleSubmit = async () => {
        const reviewId = `${Date.now()}-${uuidv4()}`;
        const submitData = {
            reviewId,
            formId,
            textAnswers,
            videoAnswers,
            rating,
            reviewer
        };
        // console.log(submitData);

        const res = await axios.post(`${apiBaseURL}/response`, submitData);
        console.log(res);
    };

    React.useEffect(() => {
        window.addEventListener('resize', detectSize);
        return () => {
            window.removeEventListener('resize', detectSize);
        };
    }, [windoDimention]);

    React.useEffect(() => {
        axios.get(`${apiBaseURL}/question/${formId}/None`).then((res) => {
            setFormData(res.data);
        });
    }, []);

    React.useEffect(() => {
        if (step1 === 3) {
            if (rating) {
                setValid(true);
            } else {
                setValid(false);
            }
        } else if (step1 === 4) {
            if (Object.keys(reviewer).length === 4) {
                setValid(true);
            }
        }
        if (!formData || step1 !== 1) return;
        if (formData[questionCount].qnType === 'text' || formData[questionCount].qnType === 'rate') {
            if (textAnswers[formData[questionCount].qnId] && textAnswers[formData[questionCount].qnId] !== '') {
                setValid(true);
            }
        } else {
            if (videoAnswers[formData[questionCount].qnId] !== undefined) {
                setValid(true);
            }
        }
    }, [step1, questionCount, rating]);

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth="sm"
                onClose={() => {
                    setOpen(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <center style={{ marginTop: '20px' }}>
                        <video width="100%" src={videourl} controls autoPlay loop />
                    </center>
                </DialogContent>
            </Dialog>

            <Container maxWidth="sm" sx={{ mt: 10 }}>
                {step1 === 5 ? <ReactConfetti width={windoDimention.width} height={windoDimention.height} tweenDuration={1000} /> : null}

                <Card>
                    <CardContent>
                        <center>
                            <img style={{ width: '100px' }} src="https://cdn.mos.cms.futurecdn.net/rjqJEKv6P9Yjy9d3KMGvp8.jpg" />
                        </center>
                        {step1 === 1 ? (
                            <>
                                <Typography variant="h3" component="h2">
                                    Share a testimonial 💙
                                </Typography>
                                <br />
                                {formData && questionCount !== formData.length && (
                                    <div key={formData[questionCount].qnId}>
                                        {formData[questionCount].qnType === 'text' ? (
                                            <>
                                                <Typography variant="h4" sx={{ mt: 2 }} component="h2">
                                                    {formData[questionCount].qnTitle}
                                                </Typography>
                                                <TextField
                                                    required
                                                    id={formData[questionCount].qnId}
                                                    value={textAnswers[formData[questionCount].qnId]}
                                                    onChange={(e) => {
                                                        handleAnswers(e), validateInput(e);
                                                    }}
                                                    variant="outlined"
                                                    multiline
                                                    rows={12}
                                                    placeholder="Write something you want us to know!"
                                                    fullWidth
                                                    sx={{ mt: 2 }}
                                                />
                                            </>
                                        ) : formData[questionCount].qnType === 'video' ? (
                                            <>
                                                <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
                                                    Record your review video!
                                                </Typography>

                                                <center>
                                                    <Button
                                                        variant="text"
                                                        endIcon={<PlayCircleIcon />}
                                                        onClick={() => {
                                                            setOpen(true);
                                                            // setVideourl(data?.videoURL)
                                                        }}
                                                    >
                                                        <Typography variant="h4" sx={{ mt: 2 }} component="h2">
                                                            View Question
                                                        </Typography>
                                                    </Button>
                                                    <br />
                                                    <br />
                                                    {dispVideo ? (
                                                        <center style={{ marginTop: '20px' }}>
                                                            <video src={mediaBlobUrl} controls autoPlay loop />
                                                        </center>
                                                    ) : (
                                                        <Webcam />
                                                    )}
                                                    <br />
                                                    <Typography variant="h4" sx={{ mb: 2 }} component="h2">
                                                        Recording a video? Don't forget to smile 😊
                                                    </Typography>
                                                </center>
                                                <center>
                                                    <Stack sx={{ mt: 2, maxWidth: '640px' }} direction="row" spacing={2}>
                                                        <Button
                                                            disabled={status === 'recording'}
                                                            variant="contained"
                                                            onClick={(e) => {
                                                                handleRecording(e, 1);
                                                            }}
                                                            fullWidth
                                                            size="large"
                                                        >
                                                            Start Recording
                                                        </Button>
                                                        <Button
                                                            id={formData[questionCount].qnId}
                                                            variant="outlined"
                                                            onClick={(e) => {
                                                                handleRecording(e, 0);
                                                            }}
                                                            fullWidth
                                                            color="error"
                                                            size="large"
                                                        >
                                                            End Recording
                                                        </Button>
                                                        {/* <Button
                                                            variant="contained"
                                                            fullWidth
                                                            onClick={() => {
                                                                setstep1(step1 + 1);
                                                            }}
                                                            endIcon={<ArrowForwardIcon />}
                                                            size="large"
                                                        >
                                                            Next
                                                        </Button> */}
                                                    </Stack>
                                                </center>
                                                <br />
                                            </>
                                        ) : (
                                            <>
                                                {/* <Typography variant="h3" sx={{ mt: 2 }} component="h2">
                                                    Do you love using our product? We'd love to hear about it!
                                                </Typography> */}

                                                <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                                                    {formData[questionCount].qnTitle}
                                                </Typography>
                                                <center>
                                                    <Rating
                                                        name="simple-controlled"
                                                        value={
                                                            textAnswers[formData[questionCount].qnId]
                                                                ? parseInt(textAnswers[formData[questionCount].qnId].split('-')[1])
                                                                : 0
                                                        }
                                                        sx={{ my: 1.5, fontSize: "2.5rem" }}
                                                        size="large"
                                                        onChange={(e, newValue) => {
                                                            e.target.value = newValue;
                                                            handleAnswers(e, formData[questionCount].qnId);
                                                            validateInput(e);
                                                        }}
                                                    />
                                                </center>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : step1 === 2 ? null : step1 === 3 ? (
                            <>
                                <Typography variant="h3" sx={{ mt: 2 }} component="h2">
                                    Do you love using our product? We'd love to hear about it!
                                </Typography>

                                {/* <center>
                                    <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                                        Rate us!
                                    </Typography>
                                    <Rating
                                        name="simple-controlled"
                                        value={rating}
                                        sx={{ mt: 0.5 }}
                                        size="large"
                                        onChange={(event, newValue) => {
                                            setrating(newValue);
                                            setValid(true);
                                        }}
                                    />
                                </center> */}
                            </>
                        ) : step1 === 4 ? (
                            <>
                                <Typography variant="h3" sx={{ mt: 2, mb: 2 }} component="h2">
                                    Almost Done 🙌
                                </Typography>

                                <TextField
                                    id="name"
                                    variant="outlined"
                                    value={reviewer.name}
                                    onChange={(e) => {
                                        handleReviewer(e);
                                    }}
                                    onBlur={validateInput}
                                    fullWidth
                                    placeholder="Full Name"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    id="email"
                                    variant="outlined"
                                    value={reviewer.email}
                                    onChange={(e) => {
                                        handleReviewer(e);
                                    }}
                                    onBlur={validateInput}
                                    fullWidth
                                    placeholder="Email address"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    id="headlines"
                                    variant="outlined"
                                    value={reviewer.headlines}
                                    onChange={(e) => {
                                        handleReviewer(e);
                                    }}
                                    onBlur={validateInput}
                                    fullWidth
                                    placeholder="Headlines"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    id="weburl"
                                    variant="outlined"
                                    value={reviewer.weburl}
                                    onChange={(e) => {
                                        handleReviewer(e);
                                    }}
                                    onBlur={validateInput}
                                    fullWidth
                                    placeholder="Your Website"
                                    sx={{ mb: 2 }}
                                />

                                <h5>Your Avatar</h5>
                                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                    <Avatar>{avatar ? <img src={avatar} /> : <PersonIcon />}</Avatar>
                                    <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            if (e.target.files.length === 1) {
                                                setAvatar(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <Button onClick={() => uploadInputRef.current && uploadInputRef.current.click()} variant="outlined">
                                        Pick an Image
                                    </Button>
                                </Stack>
                            </>
                        ) : step1 === 5 ? (
                            <>
                                <Typography variant="h3" sx={{ mt: 2, mb: 2 }} component="h2">
                                    Thank you 🙏
                                </Typography>
                                <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                                    Thank you so much for your support! We appreciate your support and we hope you enjoy using our product.
                                </Typography>
                            </>
                        ) : null}

                        {step1 === 2 ? null : step1 === 1 || step1 === 3 || step1 === 4 ? (
                            <Stack sx={{ mt: 2, mb: 2 }} direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={!prevStat}
                                    onClick={(e) => {
                                        setValid(true);
                                        if (step1 === 1) {
                                            if (questionCount === 1) {
                                                setPrevStat(false);
                                            }
                                            setQuestionCount((prev) => prev - 1);
                                        } else {
                                            if (step1 === 4) {
                                                setstep1(1);
                                            } else {
                                                setstep1((prev) => prev - 1);
                                            }
                                        }
                                    }}
                                >
                                    Previous
                                </Button>
                                <Button
                                    id="submitResponse"
                                    variant="contained"
                                    fullWidth
                                    disabled={!valid}
                                    onClick={(e) => {
                                        setValid(false);
                                        setPrevStat(true);
                                        if (formData[questionCount].qnType === 'video') {
                                            handleVideoAnswer(formData[questionCount].qnId);
                                        }
                                        if (questionCount === formData.length - 1) {
                                            if (step1 === 1) {
                                                setstep1(4);
                                            } else {
                                                if (step1 === 4) {
                                                    handleSubmit();
                                                }
                                                setstep1(step1 + 1);
                                            }
                                        } else {
                                            setQuestionCount((prev) => prev + 1);
                                        }
                                    }}
                                    size="large"
                                >
                                    {step1 === 4 ? 'Submit' : 'Next'}
                                </Button>
                            </Stack>
                        ) : null}

                        {step1 === 4 ? (
                            <center>
                                <Typography variant="subtitle2" sx={{ color: 'gray' }}>
                                    By submitting, you give us permission to use this testimonial across social channels and other marketing
                                    efforts
                                </Typography>
                            </center>
                        ) : null}
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default SamplePage;

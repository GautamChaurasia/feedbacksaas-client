import React from 'react';

// material-ui
import { Avatar, Stack, Typography, Grid, Button, Paper, Rating, ListItemAvatar,
    Chip,
    ListItemSecondaryAction, Tooltip } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ==============================|| SAMPLE PAGE ||============================== //

const Response = () => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

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
                        <>
                            <center style={{ marginTop: '20px' }} >
                                <video width="100%" src="http://media.w3.org/2010/05/sintel/trailer.mp4" controls autoPlay loop />
                            </center>
                        </>
                    </DialogContent>
            </Dialog>


            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Typography sx={{ float: 'left' }} variant="h3">Responses</Typography>
                </Grid>

                <Grid item xs={12} >
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '30px' }}>Person</TableCell>
                                <TableCell sx={{ width: '40px' }} align="left">Testimonial</TableCell>
                                <TableCell sx={{ width: '60px' }} align="left">Date</TableCell>
                                <TableCell sx={{ width: '60px' }} align="center">Status</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
                                        return (
                                            <TableRow
                                                key={item}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                <TableCell component="th" scope="row">
                                                    <Stack direction="row" spacing={1} >
                                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                                        <Typography sx={{ pt: 1 }} variant="h5" >
                                                            Test User
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left" >
                                                    <Rating name="read-only" value={5} readOnly />
                                                    <br />
                                                    
                                                    {
                                                        item === 2 || item === 4 ? (
                                                            <Button
                                                                variant="text"
                                                                endIcon={<PlayCircleIcon />}
                                                                onClick={handleClickOpen}
                                                            >
                                                                Play Video
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                <Typography sx={{ pt: 1 }} variant="p" >
                                                                    I just learned about test.com this morning and now they have a new customer. I'm head over heels about Test's project. It just works! Well done!
                                                                </Typography>
                                                            </>
                                                        )
                                                    }
                                                </TableCell>

                                                <TableCell align="left" >
                                                    <Typography sx={{ pt: 1 }} variant="p" >
                                                        Dec 10, 2022
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align="center" >
                                                    <Chip color="success" label="Public" />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    )
}
       
export default Response;

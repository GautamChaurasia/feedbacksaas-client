// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Search = () => (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12}>
            <Typography sx={{ float: 'left' }} variant="h3">Search</Typography>
        </Grid>
    </Grid>
);

export default Search;

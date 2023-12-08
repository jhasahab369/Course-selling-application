import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

function Appbar()
{
    return (
        <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="h6" sx={{ flexGrow: 1, paddingTop:0 }}> ANONYMOUS </Typography>
            <Button color="inherit" onClick={()=>{window.location('/signin')} }>Signin</Button>
            <Button color="inherit" onClick={()=>{window.location('/signup')}}>Signup</Button>
          </Toolbar>
        </AppBar>
      </Box>
  

    );
}
export default Appbar;

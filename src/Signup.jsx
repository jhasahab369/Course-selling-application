
import { Box, FormControl, TextField, Button, Typography } from '@mui/material';

import React, { useState } from 'react';
const [username, setUsername]= useState("");
const [password , setPassword]= useState("");




function Signup(){
    //always returns an HTML file- if want to use JS in here - you must use the curly braces 

    return (
        <div>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" backgroundColor="#ffffff">
            <Typography variant="h6" component="h6" gutterBottom> Sign up </Typography>
            <FormControl>
            <TextField fullWidth label="Email" variant="outlined" margin="normal" sx={{ marginBottom: '1rem' }} />
            <TextField fullWidth label="Password" variant="outlined" margin="normal" sx={{ marginTop: '0rem', marginBottom: '1rem' }} />
            <Button variant="contained" size="large" 
            
            // onClick={()=>
            // {
            //     const sendData=()=>{
            //         let username = document.getElementById("username").value ;
            //         let password= document.getElementById("password").value ;
            //         fetch("", {
            //             method: "POST"
            //         }).then((response)=>{
            //             response.json()
            //         }).then((data)=>{
            //             localStorage.setItem("token",data)
            //         })
            //     }
            // }}
            > Submit </Button>
            </FormControl>
        </Box>
            
        </div>
    )
}

export default Signup;

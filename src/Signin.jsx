

function Signin()
{
    return (
        <div>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" backgroundColor="#ffffff">
            <Typography variant="h6" component="h6" gutterBottom> Sign IN ! </Typography>
            <FormControl>
            <TextField fullWidth label="Email" variant="outlined" margin="normal" sx={{ marginBottom: '1rem' }} />
            <TextField fullWidth label="Password" variant="outlined" margin="normal" sx={{ marginTop: '0rem', marginBottom: '1rem' }} />
            <Button variant="contained" size="large"> Submit </Button>
            </FormControl>
        </Box>

        </div>
    )
}

export default Signin;

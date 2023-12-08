import React from 'react';
import Appbar from './Appbar.jsx'
import Signin from  './Signin.jsx'
import Signup from './Signup.jsx'
import Addcourse from './Addcourse.jsx'
//For routing he have this 
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom' //here BworserRouter exits in the react router dom lib- and we abbreviate it as Router 



function App()
  {
    return (
      <div >
      <Appbar/>
      <Router>
        <Routes>
          <Route path="/signin" element ={<Signin/>}></Route>
          <Route path="/signup" element ={<Signup/>}></Route>
        </Routes>
      </Router>
    
      
      
      </div>
    )

  }

  export default App;


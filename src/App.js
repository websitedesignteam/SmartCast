import React from 'react';
import Home from './Pages/Home/Home.js'
import Genres from './Pages/Genres/Genres.js'
import styles from './App.module.css'
import Navbar from './Components/Navbar/Navbar'
import Main from './Components/Main/Main'
// import Navbar from './Components/Navbar/Navbar'
import {
       BrowserRouter as Router,
       Switch,
       Route,
       Link
     } from "react-router-dom";
     
function App() {
  return (
         <Router>
              <div className={styles.rootAppContainer}>
                    <Navbar />
                    <Switch>
                           <Route exact path ="/">
                                  <Home/>
                           </Route>
                           <Route path ="/main">
                                  <Main/>
                           </Route>
                           <Route path ="/genres">
                                  <Genres/>
                           </Route>
                    </Switch>
              </div>
       </Router>
  );
}

export default App;

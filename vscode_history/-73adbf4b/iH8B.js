import logo from './logo.svg';
import './App.css';
import Header from './header';
import Slider from './slider';
import React from 'react';
import Menu from './menu';
import Product from './product';
import Testcard from './velo';
function App() {
  return (
    <React.Fragment>
       <Header />
       <Slider />  
       <Testcard />
       <Menu />
       <Product />
    </React.Fragment>
 
  );
}

export default App;

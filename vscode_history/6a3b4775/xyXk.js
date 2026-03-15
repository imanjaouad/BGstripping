import React from 'react';
import { connect } from 'react-redux';
import { increment, decrement } from './redux/actions';

function Counter({ count, increment, decrement }) {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '50px',
      fontFamily: 'Arial'
    }}>
      <h1>Compteur Redux</h1>
      <h2>{count}</h2>
      
      <div>
        <button 
          onClick={decrement}
          style={{ 
            padding: '10px 20px',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          -
        </button>
        
        <button 
          onClick={increment}
          style={{ 
            padding: '10px 20px',
            fontSize: '16px'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.count
});

const mapDispatchToProps = {
  increment,
  decrement
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
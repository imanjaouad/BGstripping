import React from 'react';
import { connect } from 'react-redux';
import { increment, decrement, reset } from './redux/actions';

function Counter({ count, increment, decrement, reset }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Compteur Redux</h1>
      <h2>{count}</h2>
      <div>
        <button onClick={decrement} style={{ margin: '0 10px', padding: '8px 16px' }}>
          -
        </button>
        <button onClick={increment} style={{ margin: '0 10px', padding: '8px 16px' }}>
          +
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={reset} style={{ padding: '8px 16px' }}>
          Réinitialiser
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
  decrement,
  reset
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

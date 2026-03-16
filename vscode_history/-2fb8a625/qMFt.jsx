import styled from "styled-components";

// Styled components
const Dv = styled.div`
  background-color: blue;
  border-radius: 13px;
  border: 2px solid blue;
  width: 100%;
  height: 150px;
`;

const Tx = styled.h1`
  color: black;
  font-size: 20px;
  
`;

const Pp = styled.p`
  color: red;
  font-size: 15px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #2980b9;
  }
`;

export default function Card(props) {
  return (
    <div className="card">
      <Dv />
      <Tx>Le titre : {props.title}</Tx>
      <Pp>Le prix : {props.prix}</Pp>
      <Button>Shop</Button>
    </div>
  );
}

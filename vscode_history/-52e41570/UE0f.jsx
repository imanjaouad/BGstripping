import styled from "styled-components";

const Bar = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #f5f5f5;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

export default function SearchBar() {
  return (
    <Bar>
      <Input placeholder="Rechercher un produit" />
    </Bar>
  );
}

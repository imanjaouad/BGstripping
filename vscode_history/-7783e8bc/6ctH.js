html {
font-size: 16px;
font-family: "Ubuntu", sans-serif;
}
body { margin: 0; }
* { box-sizing: border-box; }
#root {
padding: 2rem;
text-align: center;
flex-direction: column;
display: flex;
align-items: stretch;
justify-content: center;
min-height: 100vh;
max-width: 500px;
margin: 0 auto;
}
p { margin: 0; }
.buttons {
align-self: center;
display: flex;
flex-direction: column;
}
.buttons-row {
display: flex;
flex-direction: row;
justify-content: space-between;
}
.button {
font-family: "Ubuntu", sans-serif;
margin: 0.5rem;
line-height: 1;
border: none;
padding: 0.8rem 1rem;
font-size: 1rem;
background: #232536;
border-radius: 0.3rem;
color: white;
font-weight: 300;
width: 170px;
cursor: pointer;
}
.button:hover {
background: #2c2f44;
}
import { useState } from "react";

export default function Users(){
    const [users,setUsers] = useState([]);


    const handlerRegister = (user)=>{
        setUsers([...users,user])
    }

return (
    
)
}
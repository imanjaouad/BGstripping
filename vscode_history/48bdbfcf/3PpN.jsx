import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Users List</h2>

      {users.map(user => (
        <div key={user.id}>
          <Link to={`/users/${user.id}`}>
            {user.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Users;


route path:/filiere/yearID element filiere 

const {yearID}= useParams()

axios.get("")
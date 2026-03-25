import React, { useState } from "react";
import axios from "axios";

export default function User(props) {
  const [posts, setPosts] = useState([]);

  function HandlePosts() {
    const getData = async () => {
      try {
        const res = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?userId=${props.user.id}`
        );
        setPosts(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des posts:", error);
      }
    };

    getData(); // نادين على الدالة باش تتنفذ
    props.handleChangeActiveId(props.user.id);
  }

  return (
    <div className="child">
      <h3>
        nom: {props.user.name} {props.user.username}
      </h3>
      <p>email:{props.user.email}</p>
      <p>
        ville:{props.user.address.city} rue:{props.user.address.street}
      </p>
      <button onClick={HandlePosts}>details posts</button>

      {props.activeId === props.user.id && (
        <div>
          <h5 style={{ color: "green" }}>
            nombre des posts: {posts.length}
          </h5>

          {posts.map((post) => (
            <div className="post" key={post.id}>
              <h5>{post.title}</h5>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

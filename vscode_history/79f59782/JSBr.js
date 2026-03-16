import React, { useState } from "react";
import axios from 'axios'
export default function User(props){
const [posts,setPosts]=useState([])
function HandelPosts(){
const getData = async () => {
const posts = await axios.get(
"https://jsonplaceholder.typicode.com/posts"


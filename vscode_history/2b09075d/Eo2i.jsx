import { useState } from 'react';
export default function LoginForm({ onSubmit }) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const handleSubmit = (e) => {
 e.preventDefault();
 if (!email || !password) {
 setError('Tous les champs sont requis');
 return;
 }
 if (password.length < 6) {
 setError('Le mot de passe doit contenir au moins 6 caractères');
 return;
 }
 setError('');
 onSubmit({ email, password });
 }
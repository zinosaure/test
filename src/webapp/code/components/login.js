import React, { useState } from 'react';
import Parse from '../parseConfig';

export const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        const user = new Parse.User();
        user.set('username', username);
        user.set('password', password);
        user.set('email', email);

        try {
            await user.signUp();
            alert('User signed up successfully!');
        } catch (error) {
            alert('Error signing up: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSignUp}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button type="submit">Sign Up</button>
        </form>
    );
};
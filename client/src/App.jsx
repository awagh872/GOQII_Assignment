import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const addUser = async () => {
        try {
            await axios.post('http://localhost:3000/users', { name, email, password, dob });
            fetchUsers();
            setName('');
            setEmail('');
            setPassword('');
            setDob('');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            fetchUsers();
            cancelEdit();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const updateUser = async (id) => {
        try {
            await axios.put(`http://localhost:3000/users/${id}`, { name, email, password, dob });
            fetchUsers();
            setEditingId(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const editUser = (user) => {
          setName(user.name);
          setEmail(user.email);
          setPassword(user.password);
          setDob(user.dob);
          setEditingId(user.id);
        };
      
        const cancelEdit = () => {
          setName('');
          setEmail('');
          setPassword('');
          setDob('');
          setEditingId(null);
        };

    return (
        <div className="App">
            <h1>User Management</h1>
            <div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                {editingId ? (
                    <div>
                    <button onClick={() => updateUser(editingId)}>Update</button>
                    <button type="button" onClick={cancelEdit}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={addUser}>Add</button>
                )}
            </div>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.dob}
                        <button onClick={() => editUser(user)}>Edit</button>
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;


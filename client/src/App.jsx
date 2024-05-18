import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/users', {
        name,
        email,
        password,
        dob
      });
      setUsers([...users, response.data]);
      clearForm();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${editUserId}`, {
        name,
        email,
        password,
        dob
      });
      fetchUsers();
      clearForm();
      setEditUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setDob(user.dob);
    setEditUserId(user.id);
  };

  const cancelEdit = () => {
    clearForm();
    setEditUserId(null);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setDob('');
  };

  return (
    <div>
      <h1>User Management App</h1>
      <h2>{editUserId ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={editUserId ? updateUser : addUser}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
        {editUserId ? (
          <div>
            <button type="submit">Update User</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add User</button>
        )}
      </form>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Date of Birth:</strong> {user.dob}
            </div>
            <button onClick={() => editUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

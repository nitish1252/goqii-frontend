import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Modal, Box } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', dob: '' });
  const [editUser, setEditUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost/backend_goqii/index.php/api/user/getdetails`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      if (responseData.message==='User not found') {
        setUsers([]);
        return;
      }

      setUsers(responseData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    }
  };

  const handleCreateUser = async () => {

    if(newUser.name==='' || newUser.email==='' || newUser.password==='' || newUser.dob===''){
      toast.error('Please fill out all the fields');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', newUser.name);
    formData.append('email', newUser.email);
    formData.append('password', newUser.password);
    formData.append('dob', newUser.dob);

    await fetch('http://localhost/backend_goqii/index.php/api/user/create', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {

          const responseData = response.json();

          if (responseData.error) {
              throw new Error(responseData.error);
          }

          setNewUser({ name: '', email: '', password: '', dob: '' });
          setOpenModal(false);
          toast.success('User created successfully');
          fetchUsers();
        } else {
          toast.error('Error creating user');
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        toast.error('Error creating user');
      });
  };

  const handleEditUser = async () => {

    if(editUser.name==='' || editUser.email==='' || editUser.password==='' || editUser.dob===''){
      toast.error('Please fill out all the fields');
      return;
    }

    const formData = new FormData();
    formData.append('id', editUser.id);
    formData.append('name', editUser.name);
    formData.append('email', editUser.email);
    formData.append('password', editUser.password);
    formData.append('dob', editUser.dob);

    await fetch(`http://localhost/backend_goqii/index.php/api/user/updateuser`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {

          const responseData = response.json();

          if (responseData.error) {
              throw new Error(responseData.error);
          }

          setEditUser(null);
          setOpenModal(false);
          toast.success('User Details Updated Successfully');
          fetchUsers();
        } else {
          toast.error('Error editing user');
        }
      })
      .catch((error) => {
        console.error('Error editing user:', error);
        toast.error('Error editing user');
      });
  };

  const handleDeleteUser = (id) => {

    const formData = new FormData();
    formData.append('id', id);

    fetch(`http://localhost/backend_goqii/index.php/api/user/deleteuser`, {
        method: 'POST', // DELETE can be used
        body: formData,
    })
    .then(response => {
      if (response.ok) {
          return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      if(data.message==="User deleted successfully"){
        toast.success('User deleted successfully');
        fetchUsers();
      }
      if(data.message==='Failed to delete recipe')
        toast.error('Failed to delete recipe');
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        toast.error('There was a problem with your fetch operation:', error);
    });
  };

  return (
    <div>
      <Typography variant="h4" style={{ marginLeft: '10px', marginTop: '16px' }} gutterBottom>
        Manage Users
        <Button onClick={() => setOpenModal(true)} variant="contained" color="primary" style={{ float: 'right', marginRight: '7px', marginTop: '1px' }}>
          Create User
        </Button>
      </Typography>
      <TableContainer component={Paper} style={{ marginLeft: '10px', marginTop: '29px' }}>
        <Table>
        <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Email</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Password</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>DOB</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Actions</Typography>
              </TableCell>
            </TableRow>
        </TableHead>
          <TableBody>
          {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center' }}>No users found</TableCell>
              </TableRow>
            )}
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell style={{ wordWrap: 'break-word', maxWidth: '50px' }}>{user.name}</TableCell>
                <TableCell style={{ wordWrap: 'break-word', maxWidth: '170px' }}>{user.email}</TableCell>
                <TableCell style={{ wordWrap: 'break-word', maxWidth: '170px' }}>{user.password}</TableCell>          
                <TableCell style={{ wordWrap: 'break-word', maxWidth: '170px' }}>{user.dob}</TableCell>
                <TableCell>
                  <Button onClick={() => {setEditUser(user); setOpenModal(true)}}><EditIcon /></Button>
                  <Button onClick={() => handleDeleteUser(user.id)}><DeleteIcon /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Recipe Modal */}
      <Modal open={openModal} onClose={() => {setOpenModal(false); setEditUser(null); setNewUser({ name: '', email: '', password: '', dob: '' });}}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">{editUser ? 'Edit User' : 'Create User'}</Typography>
          <TextField label="Name" value={editUser ? editUser.name : newUser.name} onChange={e => editUser ? setEditUser({ ...editUser, name: e.target.value }) : setNewUser({ ...newUser, name: e.target.value })} style={{ marginTop: '10px' }} fullWidth required />
          <TextField label="Email" value={editUser ? editUser.email : newUser.email} onChange={e => editUser ? setEditUser({ ...editUser, email: e.target.value }) : setNewUser({ ...newUser, email: e.target.value })} style={{ marginTop: '10px' }} fullWidth required />
          <TextField label="Password" value={editUser ? editUser.password : newUser.password} onChange={e => editUser ? setEditUser({ ...editUser, password: e.target.value }) : setNewUser({ ...newUser, password: e.target.value })} style={{ marginTop: '10px' }} fullWidth required />
          <TextField
              label="DOB"
              type="date"
              value={editUser ? editUser.dob : newUser.dob}
              onChange={e => {
                  const { value } = e.target;
                  if (editUser) {
                      setEditUser({ ...editUser, dob: value });
                  } else {
                      setNewUser({ ...newUser, dob: value });
                  }
              }}
              style={{ marginTop: '10px' }}
              fullWidth
              required
              InputLabelProps={{
                  shrink: true, 
              }}
          />
          <Button onClick={editUser ? handleEditUser : handleCreateUser} style={{ marginTop: '10px' }} variant="contained">{editUser ? 'Save Changes' : 'Create'}</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserManager;




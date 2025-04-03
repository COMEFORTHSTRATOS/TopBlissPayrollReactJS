import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Zoom,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Fixed import path
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function Employees() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    startDate: '',
    salary: '',
    department: '' // Add department field
  });
  const [employees, setEmployees] = useState([]);
  const [show, setShow] = React.useState(false);

  const departments = [
    'ABLE',
    'AI Support',
    'Brand Development',
    'Branding',
    'Executive',
    'Finance',
    'Human Resources Administration',
    'Logistics',
    'Marketing',
    'Marketplace',
    'Telesales',
    'IT'
  ];

  useEffect(() => {
    fetchEmployees();
    setShow(true);
  }, []);

  const fetchEmployees = async () => {
    try {
      const q = query(collection(db, "employees"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const employeeList = [];
      querySnapshot.forEach((doc) => {
        employeeList.push({ id: doc.id, ...doc.data() });
      });
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees: ", error);
      alert("Error loading employees");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingEmployee(null);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      startDate: '',
      salary: '',
      department: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
        alert('Please fill in all required fields');
        return;
      }

      // Add timestamp for when the employee was created
      const employeeData = {
        ...newEmployee,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'employees'), employeeData);
      console.log('Employee added with ID: ', docRef.id);
      
      // Refresh the employees list
      await fetchEmployees();
      
      // Close dialog and reset form
      handleClose();
    } catch (error) {
      console.error('Error adding employee: ', error);
      alert('Error adding employee. Please try again.');
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteDoc(doc(db, 'employees', employeeId));
        await fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      position: employee.position,
      startDate: employee.startDate || '',
      salary: employee.salary || '',
      department: employee.department || ''
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
        alert('Please fill in all required fields');
        return;
      }

      await updateDoc(doc(db, 'employees', editingEmployee.id), {
        ...newEmployee,
        updatedAt: new Date().toISOString()
      });

      await fetchEmployees();
      handleClose();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Zoom in={show} timeout={300}>
        <Container sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Employees Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Add Employee
            </Button>
          </Box>
          
          <Typography variant="body1">
            Track and manage employees
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      {`${employee.firstName} ${employee.lastName}`}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department || '-'}</TableCell>
                    <TableCell>₱{employee.salary ? parseFloat(employee.salary).toLocaleString() : '-'}</TableCell>
                    <TableCell>
                      {employee.startDate ? new Date(employee.startDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {employee.status || 'active'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(employee)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(employee.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No employees found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Zoom>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                required
                value={newEmployee.firstName}
                onChange={handleInputChange}
                error={!newEmployee.firstName}
                helperText={!newEmployee.firstName ? 'First name is required' : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                required
                value={newEmployee.lastName}
                onChange={handleInputChange}
                error={!newEmployee.lastName}
                helperText={!newEmployee.lastName ? 'Last name is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                required
                type="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                error={!newEmployee.email}
                helperText={!newEmployee.email ? 'Email is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="position"
                label="Position"
                fullWidth
                value={newEmployee.position}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  name="department"
                  value={newEmployee.department}
                  label="Department"
                  onChange={handleInputChange}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={newEmployee.startDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="salary"
                label="Monthly Salary"
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                }}
                value={newEmployee.salary}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={isEditing ? handleUpdate : handleSubmit} 
            variant="contained"
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Employees;

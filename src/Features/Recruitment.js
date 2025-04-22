import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Zoom, Grid, Paper, Tabs, Tab, 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Chip, IconButton, Card, CardContent, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

// Default data
const defaultJobs = [
  { id: 1, title: 'Software Engineer', department: 'Engineering', status: 'Open', applicants: 12 },
  { id: 2, title: 'HR Manager', department: 'Human Resources', status: 'Open', applicants: 8 },
  { id: 3, title: 'Sales Representative', department: 'Sales', status: 'Closed', applicants: 15 }
];

const defaultCandidates = [
  { id: 1, name: 'John Doe', position: 'Software Engineer', jobId: 1, status: 'Screening', date: '2023-10-15' },
  { id: 2, name: 'Jane Smith', position: 'HR Manager', jobId: 2, status: 'Interview', date: '2023-10-10' },
  { id: 3, name: 'Mike Johnson', position: 'Sales Representative', jobId: 3, status: 'Hired', date: '2023-09-28' }
];

const defaultPipeline = [
  { stage: 'New Applications', count: 18 },
  { stage: 'Screening', count: 12 },
  { stage: 'Interview', count: 8 },
  { stage: 'Assessment', count: 5 },
  { stage: 'Offer', count: 2 },
  { stage: 'Hired', count: 3 }
];

function Recruitment() {
  const [show, setShow] = React.useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Use state for jobs without localStorage initialization
  const [jobs, setJobs] = useState([]);
  
  // Initialize candidates from Firestore instead of localStorage
  const [candidates, setCandidates] = useState([]);
  
  const [pipeline, setPipeline] = useState(() => {
    const savedPipeline = localStorage.getItem('recruitmentPipeline');
    return savedPipeline ? JSON.parse(savedPipeline) : defaultPipeline;
  });

  // Modal states
  const [addJobDialogOpen, setAddJobDialogOpen] = useState(false);
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
  const [viewJobDialogOpen, setViewJobDialogOpen] = useState(false);
  const [deleteJobDialogOpen, setDeleteJobDialogOpen] = useState(false);
  const [addCandidateDialogOpen, setAddCandidateDialogOpen] = useState(false);
  const [editCandidateDialogOpen, setEditCandidateDialogOpen] = useState(false);
  const [viewCandidateDialogOpen, setViewCandidateDialogOpen] = useState(false);
  const [deleteCandidateDialogOpen, setDeleteCandidateDialogOpen] = useState(false);
  const [viewPipelineCandidatesDialogOpen, setViewPipelineCandidatesDialogOpen] = useState(false);
  
  // Current selected item
  const [currentJob, setCurrentJob] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  
  // New item form data
  const [newJob, setNewJob] = useState({ title: '', department: '', status: 'Open', applicants: 0 });
  const [newCandidate, setNewCandidate] = useState({ 
    firstName: '',
    middleName: '',
    lastName: '',
    name: '',
    phoneNumber: '',
    resumeLink: '', 
    position: '', 
    jobId: null, 
    status: 'New Applications', 
    date: new Date().toISOString().split('T')[0] 
  });

  // Fetch jobs from Firestore
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobsCollection = collection(db, 'jobs');
      const jobsSnapshot = await getDocs(jobsCollection);
      const jobsList = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // If no jobs exist in Firestore yet, initialize with default jobs
      if (jobsList.length === 0) {
        await Promise.all(defaultJobs.map(job => 
          addDoc(collection(db, 'jobs'), { 
            title: job.title, 
            department: job.department, 
            status: job.status, 
            applicants: job.applicants 
          })
        ));
        fetchJobs(); // Fetch again after initialization
        return;
      }
      
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidates from Firestore jobApplications collection
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const candidatesCollection = collection(db, 'jobApplications');
      const candidatesSnapshot = await getDocs(candidatesCollection);
      const candidatesList = candidatesSnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Combine name fields if they exist
        let fullName = data.name; // Use existing name field if present
        if (!fullName && (data.firstName || data.lastName)) {
          fullName = [
            data.firstName || '',
            data.middleName || '',
            data.lastName || ''
          ].filter(namePart => namePart.trim() !== '').join(' ');
        }
        
        // Normalize data to ensure all required fields exist
        return {
          id: doc.id,
          // Store original name parts for editing
          firstName: data.firstName || '',
          middleName: data.middleName || '',
          lastName: data.lastName || '',
          // Use combined name for display
          name: fullName || data.candidateName || data.fullName || 'Unknown',
          phoneNumber: data.phoneNumber || data.phone || data.contactNumber || '',
          resumeLink: data.resumeLink || data.resume || data.cvLink || '',
          position: data.position || data.jobTitle || data.role || 'Not specified',
          jobId: data.jobId || null,
          status: data.status || data.applicationStatus || 'New Applications',
          date: data.date || data.applicationDate || data.submissionDate || new Date().toISOString().split('T')[0]
        };
      });
      
      // If no candidates exist in Firestore yet, initialize with default candidates
      if (candidatesList.length === 0) {
        await Promise.all(defaultCandidates.map(candidate => 
          addDoc(collection(db, 'jobApplications'), { 
            name: candidate.name, 
            position: candidate.position, 
            jobId: candidate.jobId, 
            status: candidate.status, 
            date: candidate.date 
          })
        ));
        fetchCandidates(); // Fetch again after initialization
        return;
      }
      
      console.log("Fetched candidates:", candidatesList); // Debug log
      setCandidates(candidatesList);
      
      // Update pipeline counts based on fetched candidates
      const updatedPipeline = recalculatePipeline(candidatesList);
      setPipeline(updatedPipeline);
      
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  // Save only pipeline to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recruitmentPipeline', JSON.stringify(pipeline));
  }, [pipeline]);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    if (!status) return 'default'; // Add null/undefined check
    
    switch(status.toLowerCase()) {
      case 'open': return 'success';
      case 'closed': return 'error';
      case 'screening': return 'primary';
      case 'interview': return 'warning';
      case 'hired': return 'success';
      default: return 'default';
    }
  };

  // Calculate pipeline counts based on candidates
  const recalculatePipeline = (candidatesList) => {
    const stages = pipeline.map(p => p.stage);
    const counts = {};
    
    // Initialize all counts to 0
    stages.forEach(stage => {
      counts[stage] = 0;
    });
    
    // Count candidates in each stage
    candidatesList.forEach(candidate => {
      if (candidate.status && counts[candidate.status] !== undefined) {
        counts[candidate.status]++;
      } else if (candidate.status) {
        // If status exists but doesn't match any pipeline stage, count as New Applications
        counts['New Applications'] = (counts['New Applications'] || 0) + 1;
      }
    });
    
    // Update pipeline with new counts
    const updatedPipeline = pipeline.map(p => ({
      ...p,
      count: counts[p.stage] || 0
    }));
    
    return updatedPipeline;
  };

  // Update job applicant counts based on candidates
  const recalculateJobApplicants = (jobsList, candidatesList) => {
    const jobCounts = {};
    
    // Initialize counts for all jobs to 0
    jobsList.forEach(job => {
      jobCounts[job.id] = 0;
    });
    
    // Count candidates for each job
    candidatesList.forEach(candidate => {
      // First check if candidate has a direct jobId reference
      if (jobCounts[candidate.jobId] !== undefined) {
        jobCounts[candidate.jobId]++;
      } 
      // If no direct jobId match or jobId is null, check if position matches a job title
      else {
        const candidatePosition = (candidate.position || '').toLowerCase().trim();
        if (candidatePosition) {
          // Find jobs where the title matches the candidate's position
          jobsList.forEach(job => {
            const jobTitle = (job.title || '').toLowerCase().trim();
            if (jobTitle && candidatePosition === jobTitle) {
              jobCounts[job.id]++;
            }
          });
        }
      }
    });
    
    // Update jobs with new applicant counts
    return jobsList.map(job => ({
      ...job,
      applicants: jobCounts[job.id] || 0
    }));
  };

  // Update Firestore when candidates affect job applicant counts
  const updateJobApplicantsInFirestore = async (updatedJobs) => {
    for (const job of updatedJobs) {
      try {
        const jobRef = doc(db, 'jobs', job.id);
        await updateDoc(jobRef, { applicants: job.applicants });
      } catch (error) {
        console.error("Error updating job applicant count:", error);
      }
    }
  };

  // Ensure data consistency on initial load
  useEffect(() => {
    if (jobs.length > 0) {
      // Update pipeline counts based on candidates
      const updatedPipeline = recalculatePipeline(candidates);
      setPipeline(updatedPipeline);
      
      // Update job applicant counts based on candidates
      const updatedJobs = recalculateJobApplicants(jobs, candidates);
      
      // Update jobs in Firestore with correct applicant counts
      updatedJobs.forEach(async (job) => {
        try {
          const jobRef = doc(db, 'jobs', job.id);
          await updateDoc(jobRef, { applicants: job.applicants });
        } catch (error) {
          console.error("Error updating job applicant count:", error);
        }
      });
      
      setJobs(updatedJobs);
    }
  }, [jobs.length]);

  // Job CRUD operations with Firestore
  const handleAddJob = async () => {
    try {
      const jobToAdd = { 
        title: newJob.title, 
        department: newJob.department, 
        status: newJob.status, 
        applicants: 0 
      };
      
      const docRef = await addDoc(collection(db, 'jobs'), jobToAdd);
      
      // Add the new job to the state with the Firestore ID
      setJobs([...jobs, { id: docRef.id, ...jobToAdd }]);
      setNewJob({ title: '', department: '', status: 'Open', applicants: 0 });
      setAddJobDialogOpen(false);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleEditJob = async () => {
    try {
      // Keep the applicants count intact when editing
      const currentApplicants = jobs.find(job => job.id === currentJob.id).applicants;
      const jobToUpdate = { 
        title: currentJob.title,
        department: currentJob.department,
        status: currentJob.status,
        applicants: currentApplicants
      };
      
      // Update in Firestore
      const jobRef = doc(db, 'jobs', currentJob.id);
      await updateDoc(jobRef, jobToUpdate);
      
      // Update in state
      const updatedJobs = jobs.map(job => 
        job.id === currentJob.id ? { id: currentJob.id, ...jobToUpdate } : job
      );
      setJobs(updatedJobs);
      setEditJobDialogOpen(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async () => {
    try {
      // Delete from Firestore
      const jobRef = doc(db, 'jobs', currentJob.id);
      await deleteDoc(jobRef);
      
      // Update state
      const updatedJobs = jobs.filter(job => job.id !== currentJob.id);
      
      // Handle linked candidates when a job is deleted
      const updatedCandidates = candidates.map(candidate => 
        candidate.jobId === currentJob.id 
          ? { ...candidate, jobId: null, position: `${candidate.position} (Job Deleted)` }
          : candidate
      );
      
      setCandidates(updatedCandidates);
      setJobs(updatedJobs);
      setDeleteJobDialogOpen(false);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  // Candidate CRUD operations - Updated for Firestore
  const handleAddCandidate = async () => {
    try {
      // Split the name if it's in a combined format
      const nameParts = newCandidate.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
      
      const candidateToAdd = { 
        firstName,
        middleName,
        lastName,
        name: newCandidate.name,
        phoneNumber: newCandidate.phoneNumber,
        resumeLink: newCandidate.resumeLink,
        position: newCandidate.position,
        jobId: newCandidate.jobId,
        status: newCandidate.status,
        date: newCandidate.date
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'jobApplications'), candidateToAdd);
      
      // Add to state with the Firestore ID
      const newCandidateWithId = { id: docRef.id, ...candidateToAdd };
      const updatedCandidates = [...candidates, newCandidateWithId];
      
      setCandidates(updatedCandidates);
      setNewCandidate({ 
        firstName: '',
        middleName: '',
        lastName: '',
        name: '',
        phoneNumber: '', 
        resumeLink: '', 
        position: '', 
        jobId: null, 
        status: 'New Applications', 
        date: new Date().toISOString().split('T')[0] 
      });
      
      // Update pipeline counts
      const updatedPipeline = recalculatePipeline(updatedCandidates);
      setPipeline(updatedPipeline);
      
      // Update job applicant counts if the candidate is linked to a job
      if (candidateToAdd.jobId) {
        const updatedJobs = recalculateJobApplicants(jobs, updatedCandidates);
        setJobs(updatedJobs);
        updateJobApplicantsInFirestore(updatedJobs);
      }
      
      setAddCandidateDialogOpen(false);
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const handleEditCandidate = async () => {
    try {
      // Store the old values to update counts
      const oldCandidate = candidates.find(c => c.id === currentCandidate.id);
      
      // Update in Firestore
      const candidateRef = doc(db, 'jobApplications', currentCandidate.id);
      await updateDoc(candidateRef, {
        firstName: currentCandidate.firstName || '',
        middleName: currentCandidate.middleName || '',
        lastName: currentCandidate.lastName || '',
        name: currentCandidate.name,
        phoneNumber: currentCandidate.phoneNumber || '',
        resumeLink: currentCandidate.resumeLink || '',
        position: currentCandidate.position,
        jobId: currentCandidate.jobId,
        status: currentCandidate.status,
        date: currentCandidate.date
      });
      
      // Update in state
      const updatedCandidates = candidates.map(candidate => 
        candidate.id === currentCandidate.id ? currentCandidate : candidate
      );
      
      setCandidates(updatedCandidates);
      
      // Update pipeline counts
      const updatedPipeline = recalculatePipeline(updatedCandidates);
      setPipeline(updatedPipeline);
      
      // Update job applicant counts if job assignment changed
      if (oldCandidate.jobId !== currentCandidate.jobId) {
        const updatedJobs = recalculateJobApplicants(jobs, updatedCandidates);
        setJobs(updatedJobs);
        updateJobApplicantsInFirestore(updatedJobs);
      }
      
      setEditCandidateDialogOpen(false);
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  const handleDeleteCandidate = async () => {
    try {
      // Delete from Firestore
      const candidateRef = doc(db, 'jobApplications', currentCandidate.id);
      await deleteDoc(candidateRef);
      
      // Remove from state
      const updatedCandidates = candidates.filter(candidate => candidate.id !== currentCandidate.id);
      
      setCandidates(updatedCandidates);
      
      // Update pipeline counts
      const updatedPipeline = recalculatePipeline(updatedCandidates);
      setPipeline(updatedPipeline);
      
      // Update job applicant counts if the candidate was linked to a job
      if (currentCandidate.jobId) {
        const updatedJobs = recalculateJobApplicants(jobs, updatedCandidates);
        setJobs(updatedJobs);
        updateJobApplicantsInFirestore(updatedJobs);
      }
      
      setDeleteCandidateDialogOpen(false);
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  // Function to get candidates for a specific pipeline stage
  const getCandidatesForStage = (stage) => {
    return candidates.filter(candidate => candidate.status === stage);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Zoom in={show} timeout={300}>
        <Container sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
              Applicant Tracking System
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => tabValue === 0 ? setAddJobDialogOpen(true) : setAddCandidateDialogOpen(true)}
            >
              {tabValue === 0 ? 'New Job Posting' : 'Add Candidate'}
            </Button>
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Job Postings" />
            <Tab label="Candidates" />
            <Tab label="Recruitment Pipeline" />
          </Tabs>

          {tabValue === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applicants</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <Chip label={job.status} color={getStatusColor(job.status)} size="small" />
                      </TableCell>
                      <TableCell>{job.applicants}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => {
                          setCurrentJob(job);
                          setViewJobDialogOpen(true);
                        }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          setCurrentJob({...job});
                          setEditJobDialogOpen(true);
                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          setCurrentJob(job);
                          setDeleteJobDialogOpen(true);
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Resume</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Application Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">Loading candidates...</TableCell>
                    </TableRow>
                  ) : candidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No candidates found</TableCell>
                    </TableRow>
                  ) : (
                    candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>{candidate.name || 'Unknown'}</TableCell>
                        <TableCell>{candidate.position || 'Not specified'}</TableCell>
                        <TableCell>{candidate.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>
                          {candidate.resumeLink ? (
                            <IconButton 
                              size="small" 
                              component="a" 
                              href={candidate.resumeLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              color="primary"
                            >
                              <FileOpenIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={candidate.status || 'New Applications'} 
                            color={getStatusColor(candidate.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{candidate.date || 'No date'}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => {
                            setCurrentCandidate(candidate);
                            setViewCandidateDialogOpen(true);
                          }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => {
                            setCurrentCandidate({...candidate});
                            setEditCandidateDialogOpen(true);
                          }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => {
                            setCurrentCandidate(candidate);
                            setDeleteCandidateDialogOpen(true);
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              {pipeline.map((stage, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{stage.stage}</Typography>
                      <Typography variant="h3" align="center" sx={{ my: 2 }}>{stage.count}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Button 
                        variant="outlined" 
                        fullWidth
                        onClick={() => {
                          setCurrentStage(stage.stage);
                          setViewPipelineCandidatesDialogOpen(true);
                        }}
                      >
                        View Candidates
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Job Dialogs */}
          <Dialog open={addJobDialogOpen} onClose={() => setAddJobDialogOpen(false)}>
            <DialogTitle>Create New Job Posting</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Job Title"
                fullWidth
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Department"
                fullWidth
                value={newJob.department}
                onChange={(e) => setNewJob({...newJob, department: e.target.value})}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newJob.status}
                  label="Status"
                  onChange={(e) => setNewJob({...newJob, status: e.target.value})}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddJobDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddJob} variant="contained">Create</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editJobDialogOpen} onClose={() => setEditJobDialogOpen(false)}>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogContent>
              {currentJob && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Job Title"
                    fullWidth
                    value={currentJob.title}
                    onChange={(e) => setCurrentJob({...currentJob, title: e.target.value})}
                  />
                  <TextField
                    margin="dense"
                    label="Department"
                    fullWidth
                    value={currentJob.department}
                    onChange={(e) => setCurrentJob({...currentJob, department: e.target.value})}
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={currentJob.status}
                      label="Status"
                      onChange={(e) => setCurrentJob({...currentJob, status: e.target.value})}
                    >
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditJobDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditJob} variant="contained">Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={viewJobDialogOpen} onClose={() => setViewJobDialogOpen(false)}>
            <DialogTitle>Job Details</DialogTitle>
            <DialogContent>
              {currentJob && (
                <>
                  <Typography variant="subtitle1">Job Title</Typography>
                  <Typography paragraph>{currentJob.title}</Typography>
                  
                  <Typography variant="subtitle1">Department</Typography>
                  <Typography paragraph>{currentJob.department}</Typography>
                  
                  <Typography variant="subtitle1">Status</Typography>
                  <Chip label={currentJob.status} color={getStatusColor(currentJob.status)} />
                  
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Applicants</Typography>
                  <Typography paragraph>{currentJob.applicants}</Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewJobDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteJobDialogOpen} onClose={() => setDeleteJobDialogOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the job posting "{currentJob?.title}"?
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteJobDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteJob} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>

          {/* Candidate Dialogs */}
          <Dialog open={addCandidateDialogOpen} onClose={() => setAddCandidateDialogOpen(false)}>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="First Name"
                fullWidth
                value={newCandidate.firstName || ''}
                onChange={(e) => {
                  const firstName = e.target.value;
                  setNewCandidate({
                    ...newCandidate, 
                    firstName,
                    name: `${firstName} ${newCandidate.middleName || ''} ${newCandidate.lastName || ''}`.trim()
                  });
                }}
              />
              <TextField
                margin="dense"
                label="Middle Name"
                fullWidth
                value={newCandidate.middleName || ''}
                onChange={(e) => {
                  const middleName = e.target.value;
                  setNewCandidate({
                    ...newCandidate, 
                    middleName,
                    name: `${newCandidate.firstName || ''} ${middleName} ${newCandidate.lastName || ''}`.trim()
                  });
                }}
              />
              <TextField
                margin="dense"
                label="Last Name"
                fullWidth
                value={newCandidate.lastName || ''}
                onChange={(e) => {
                  const lastName = e.target.value;
                  setNewCandidate({
                    ...newCandidate, 
                    lastName,
                    name: `${newCandidate.firstName || ''} ${newCandidate.middleName || ''} ${lastName}`.trim()
                  });
                }}
              />
              <TextField
                margin="dense"
                label="Phone Number"
                fullWidth
                value={newCandidate.phoneNumber || ''}
                onChange={(e) => setNewCandidate({...newCandidate, phoneNumber: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Resume Link"
                fullWidth
                value={newCandidate.resumeLink || ''}
                onChange={(e) => setNewCandidate({...newCandidate, resumeLink: e.target.value})}
                placeholder="URL to resume/CV document"
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Job Position</InputLabel>
                <Select
                  value={newCandidate.jobId || ''}
                  label="Job Position"
                  onChange={(e) => {
                    const jobId = e.target.value;
                    const selectedJob = jobs.find(job => job.id === jobId);
                    setNewCandidate({
                      ...newCandidate, 
                      jobId: jobId,
                      position: selectedJob ? selectedJob.title : ''
                    });
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {jobs.filter(job => job.status === 'Open').map((job) => (
                    <MenuItem key={job.id} value={job.id}>{job.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {!newCandidate.jobId && (
                <TextField
                  margin="dense"
                  label="Position (Manual Entry)"
                  fullWidth
                  value={newCandidate.position}
                  onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
                />
              )}
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCandidate.status}
                  label="Status"
                  onChange={(e) => setNewCandidate({...newCandidate, status: e.target.value})}
                >
                  <MenuItem value="New Applications">New Applications</MenuItem>
                  <MenuItem value="Screening">Screening</MenuItem>
                  <MenuItem value="Interview">Interview</MenuItem>
                  <MenuItem value="Assessment">Assessment</MenuItem>
                  <MenuItem value="Offer">Offer</MenuItem>
                  <MenuItem value="Hired">Hired</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="Application Date"
                type="date"
                fullWidth
                value={newCandidate.date}
                onChange={(e) => setNewCandidate({...newCandidate, date: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddCandidateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCandidate} variant="contained">Add</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editCandidateDialogOpen} onClose={() => setEditCandidateDialogOpen(false)}>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogContent>
              {currentCandidate && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="First Name"
                    fullWidth
                    value={currentCandidate.firstName || ''}
                    onChange={(e) => setCurrentCandidate({
                      ...currentCandidate, 
                      firstName: e.target.value,
                      name: `${e.target.value} ${currentCandidate.middleName || ''} ${currentCandidate.lastName || ''}`.trim()
                    })}
                  />
                  <TextField
                    margin="dense"
                    label="Middle Name"
                    fullWidth
                    value={currentCandidate.middleName || ''}
                    onChange={(e) => setCurrentCandidate({
                      ...currentCandidate, 
                      middleName: e.target.value,
                      name: `${currentCandidate.firstName || ''} ${e.target.value} ${currentCandidate.lastName || ''}`.trim()
                    })}
                  />
                  <TextField
                    margin="dense"
                    label="Last Name"
                    fullWidth
                    value={currentCandidate.lastName || ''}
                    onChange={(e) => setCurrentCandidate({
                      ...currentCandidate, 
                      lastName: e.target.value,
                      name: `${currentCandidate.firstName || ''} ${currentCandidate.middleName || ''} ${e.target.value}`.trim()
                    })}
                  />
                  <TextField
                    margin="dense"
                    label="Phone Number"
                    fullWidth
                    value={currentCandidate.phoneNumber || ''}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, phoneNumber: e.target.value})}
                  />
                  <TextField
                    margin="dense"
                    label="Resume Link"
                    fullWidth
                    value={currentCandidate.resumeLink || ''}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, resumeLink: e.target.value})}
                    placeholder="URL to resume/CV document"
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Job Position</InputLabel>
                    <Select
                      value={currentCandidate.jobId || ''}
                      label="Job Position"
                      onChange={(e) => {
                        const jobId = e.target.value;
                        const selectedJob = jobs.find(job => job.id === jobId);
                        setCurrentCandidate({
                          ...currentCandidate, 
                          jobId: jobId,
                          position: selectedJob ? selectedJob.title : currentCandidate.position
                        });
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {jobs.filter(job => job.status === 'Open').map((job) => (
                        <MenuItem key={job.id} value={job.id}>{job.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {!currentCandidate.jobId && (
                    <TextField
                      margin="dense"
                      label="Position (Manual Entry)"
                      fullWidth
                      value={currentCandidate.position}
                      onChange={(e) => setCurrentCandidate({...currentCandidate, position: e.target.value})}
                    />
                  )}
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={currentCandidate.status}
                      label="Status"
                      onChange={(e) => setCurrentCandidate({...currentCandidate, status: e.target.value})}
                    >
                      <MenuItem value="New Applications">New Applications</MenuItem>
                      <MenuItem value="Screening">Screening</MenuItem>
                      <MenuItem value="Interview">Interview</MenuItem>
                      <MenuItem value="Assessment">Assessment</MenuItem>
                      <MenuItem value="Offer">Offer</MenuItem>
                      <MenuItem value="Hired">Hired</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    margin="dense"
                    label="Application Date"
                    type="date"
                    fullWidth
                    value={currentCandidate.date}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, date: e.target.value})}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditCandidateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditCandidate} variant="contained">Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={viewCandidateDialogOpen} onClose={() => setViewCandidateDialogOpen(false)}>
            <DialogTitle>Candidate Details</DialogTitle>
            <DialogContent>
              {currentCandidate && (
                <>
                  <Typography variant="subtitle1">Name</Typography>
                  <Typography paragraph>{currentCandidate.name}</Typography>
                  
                  <Typography variant="subtitle1">Phone Number</Typography>
                  <Typography paragraph>{currentCandidate.phoneNumber || 'Not provided'}</Typography>
                  
                  <Typography variant="subtitle1">Position</Typography>
                  <Typography paragraph>{currentCandidate.position}</Typography>
                  

                  <Typography paragraph>
                    {currentCandidate.jobId ? 
                      jobs.find(job => job.id === currentCandidate.jobId)?.title || 'Unknown Job' : 
                      'No specific job'}
                  </Typography>
                  
                  <Typography variant="subtitle1">Resume</Typography>
                  {currentCandidate.resumeLink ? (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component="a" 
                      href={currentCandidate.resumeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ mt: 1, mb: 2 }}
                    >
                      View Resume
                    </Button>
                  ) : (
                    <Typography paragraph>No resume available</Typography>
                  )}
                  
                  <Typography variant="subtitle1">Status</Typography>
                  <Chip label={currentCandidate.status} color={getStatusColor(currentCandidate.status)} />
                  
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Application Date</Typography>
                  <Typography paragraph>{currentCandidate.date}</Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewCandidateDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteCandidateDialogOpen} onClose={() => setDeleteCandidateDialogOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the candidate "{currentCandidate?.name}"?
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteCandidateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteCandidate} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>

          {/* Pipeline Candidates Dialog */}
          <Dialog open={viewPipelineCandidatesDialogOpen} onClose={() => setViewPipelineCandidatesDialogOpen(false)}>
            <DialogTitle>Candidates in {currentStage}</DialogTitle>
            <DialogContent>
              {currentStage && getCandidatesForStage(currentStage).length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Application Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCandidatesForStage(currentStage).map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell>{candidate.position}</TableCell>
                          <TableCell>{candidate.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No candidates in this stage.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewPipelineCandidatesDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Zoom>
    </Box>
  );
}

export default Recruitment;

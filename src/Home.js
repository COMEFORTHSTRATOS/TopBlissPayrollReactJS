import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Zoom, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  People, 
  AttachMoney, 
  Event, 
  Assignment, 
  ArrowUpward, 
  AccessTime, 
  Add,
  Person,
  AccountBalance,
  Work,
  CheckCircle,
  TimerOutlined,
  MoreVert,
  CalendarMonth,
  TrendingUp,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './firebase';

function Home() {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [jobStats, setJobStats] = useState({ open: 0, closed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [recruitmentPipeline, setRecruitmentPipeline] = useState([]);

  // Standard department colors for consistency
  const departmentColors = {
    'IT': '#4CAF50',
    'Marketing': '#2196F3',
    'Sales': '#FF9800',
    'HR': '#9C27B0',
    'Finance': '#F44336',
    'Executive': '#795548',
    'ABLE': '#607D8B',
    'AI Support': '#00BCD4',
    'Brand Development': '#E91E63',
    'Branding': '#3F51B5',
    'Human Resources Administration': '#9C27B0',
    'Logistics': '#FF5722',
    'Marketplace': '#FFEB3B',
    'Telesales': '#FF9800',
    'Other': '#9E9E9E'
  };

  useEffect(() => {
    setShow(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch employee data
      const employeesCollection = collection(db, "employees");
      const employeesSnapshot = await getDocs(employeesCollection);
      const employeeList = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeList);
      
      // Generate department statistics based on employee data
      calculateDepartmentDistribution(employeeList);
      
      // Fetch recent job applications
      const applicationsQuery = query(collection(db, "jobApplications"), orderBy("date", "desc"), limit(4));
      const applicationsSnapshot = await getDocs(applicationsQuery);
      const applicationsList = applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentApplications(applicationsList);
      
      // Fetch recruitment pipeline data
      fetchRecruitmentPipeline(applicationsList);
      
      // Fetch job stats
      const jobsQuery = query(collection(db, "jobs"));
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const openJobs = jobsList.filter(job => job.status === 'Open').length;
      setJobStats({
        open: openJobs,
        closed: jobsList.length - openJobs,
        total: jobsList.length
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate department distribution from employee data
  const calculateDepartmentDistribution = (employeeList) => {
    // Count employees by department
    const departmentCounts = {};
    
    employeeList.forEach(employee => {
      if (employee.department) {
        departmentCounts[employee.department] = (departmentCounts[employee.department] || 0) + 1;
      } else {
        departmentCounts['Other'] = (departmentCounts['Other'] || 0) + 1;
      }
    });
    
    // Convert to format needed for pie chart
    const departmentData = Object.keys(departmentCounts).map(department => ({
      id: department,
      value: departmentCounts[department],
      color: departmentColors[department] || departmentColors['Other']
    }));
    
    setDepartmentStats(departmentData);
  };

  // Get recruitment pipeline data from job applications
  const fetchRecruitmentPipeline = (applicationsList) => {
    // First try to get the pipeline data from localStorage (where Recruitment.js stores it)
    const savedPipeline = localStorage.getItem('recruitmentPipeline');
    const localStoragePipeline = savedPipeline ? JSON.parse(savedPipeline) : null;
    
    // Default counts to use if nothing is in localStorage
    const defaultCounts = {
      'New Applications': 18,
      'Screening': 12,
      'Interview': 8,
      'Assessment': 5,
      'Offer': 2,
      'Hired': 3
    };
    
    // Initialize status counts
    const statusCounts = {
      'New Applications': 0,
      'Screening': 0,
      'Interview': 0,
      'Assessment': 0,
      'Offer': 0,
      'Hired': 0
    };
    
    // Count applications by status
    applicationsList.forEach(application => {
      const status = application.status || 'New Applications';
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      } else {
        statusCounts['New Applications']++;
      }
    });
    
    // Use this hierarchy:
    // 1. Real application data if available
    // 2. LocalStorage data from Recruitment.js if available
    // 3. Default counts as fallback
    const hasRealData = Object.values(statusCounts).some(count => count > 0);
    
    // Format for the recruitment pipeline display
    let pipelineData;
    
    if (hasRealData) {
      // If we have real data, use it
      pipelineData = [
        { stage: 'New Applications', value: statusCounts['New Applications'] },
        { stage: 'Screening', value: statusCounts['Screening'] },
        { stage: 'Interview', value: statusCounts['Interview'] },
        { stage: 'Assessment', value: statusCounts['Assessment'] },
        { stage: 'Offer', value: statusCounts['Offer'] },
        { stage: 'Hired', value: statusCounts['Hired'] }
      ];
    } else if (localStoragePipeline) {
      // If no real data but localStorage data exists, convert its format
      // (localStorage uses 'count' property, we need 'value')
      pipelineData = localStoragePipeline.map(item => ({
        stage: item.stage,
        value: item.count
      }));
    } else {
      // Fall back to default values if nothing else is available
      pipelineData = [
        { stage: 'New Applications', value: defaultCounts['New Applications'] },
        { stage: 'Screening', value: defaultCounts['Screening'] },
        { stage: 'Interview', value: defaultCounts['Interview'] },
        { stage: 'Assessment', value: defaultCounts['Assessment'] },
        { stage: 'Offer', value: defaultCounts['Offer'] },
        { stage: 'Hired', value: defaultCounts['Hired'] }
      ];
    }
    
    setRecruitmentPipeline(pipelineData);
  };

  // Mock data for stats that aren't fetched from Firebase yet
  const stats = [
    { 
      title: 'Total Employees', 
      value: employees.length || '0', 
      icon: <People fontSize="large" sx={{ color: '#4CAF50' }} />, 
      change: '+4%',
      color: '#E8F5E9'
    },
    { 
      title: 'Open Positions', 
      value: jobStats.open || '0', 
      icon: <Work fontSize="large" sx={{ color: '#FF9800' }} />, 
      change: '+20%',
      color: '#FFF3E0'
    },
    { 
      title: 'New Applications', 
      value: recentApplications.length || '0', 
      icon: <Assignment fontSize="large" sx={{ color: '#9C27B0' }} />, 
      change: '+15%',
      color: '#F3E5F5'
    }
  ];

  // Custom pie chart component using Material-UI components
  const SimplePieChart = ({ data }) => {
    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if (total === 0) {
      return (
        <Box sx={{ 
          height: 180, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Typography color="text.secondary">No department data available</Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ position: 'relative', width: 180, height: 180, mx: 'auto' }}>
        {/* Chart background */}
        <Box sx={{ 
          position: 'absolute', 
          width: 180, 
          height: 180, 
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)'
        }}>
          {data.map((item, index) => {
            // Calculate percentage for this segment
            const percentage = (item.value / total) * 100;
            
            // Accumulate percentages for positioning
            const previousPercentages = data
              .slice(0, index)
              .reduce((sum, prevItem) => sum + (prevItem.value / total) * 100, 0);
            
            return (
              <Box 
                key={item.id} 
                sx={{ 
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: item.color,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * previousPercentages / 100 - Math.PI/2)}% ${50 + 50 * Math.sin(2 * Math.PI * previousPercentages / 100 - Math.PI/2)}%, ${50 + 50 * Math.cos(2 * Math.PI * (previousPercentages + percentage) / 100 - Math.PI/2)}% ${50 + 50 * Math.sin(2 * Math.PI * (previousPercentages + percentage) / 100 - Math.PI/2)}%)`
                }}
              />
            );
          })}
        </Box>
        
        {/* Center hole */}
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: 90,
          height: 90,
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <PieChartIcon color="action" sx={{ fontSize: 36, opacity: 0.6 }} />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <Zoom in={show} timeout={300}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              TopBliss HR Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <CalendarMonth sx={{ verticalAlign: 'middle', mr: 1 }} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent sx={{ background: stat.color, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'white', width: 56, height: 56 }}>
                        {stat.icon}
                      </Avatar>
                      {stat.change && (
                        <Typography variant="caption" color="success.main" sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          p: 0.5,
                          borderRadius: 1
                        }}>
                          <ArrowUpward fontSize="small" /> {stat.change}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* Main Dashboard Content */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Recent Employees */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Recent Employees
                      </Typography>
                      <Button component={Link} to="/employees" size="small" endIcon={<MoreVert />}>
                        View All
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      {(employees.length > 0 ? employees : Array(4).fill(null)).slice(0, 4).map((employee, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
                            <Avatar sx={{ bgcolor: `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`, mr: 2 }}>
                              {employee ? employee.firstName?.charAt(0) || 'E' : 'E'}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {employee ? `${employee.firstName} ${employee.lastName}` : 'Loading...'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {employee ? employee.position || 'N/A' : 'Position'}
                              </Typography>
                              {employee && employee.department && (
                                <Typography variant="caption" color="text.secondary">
                                  {employee.department}
                                </Typography>
                              )}
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    {employees.length === 0 && !loading && (
                      <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                        No employee data available
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                
                {/* Recruitment Funnel */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Recruitment Pipeline
                      </Typography>
                      <Button component={Link} to="/recruitment" size="small" endIcon={<MoreVert />}>
                        Manage
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Grid container spacing={2} alignItems="flex-end" sx={{ pb: 2 }}>
                        {recruitmentPipeline.map((stage, index) => (
                          <Grid item xs key={index} sx={{ textAlign: 'center' }}>
                            <Box sx={{ position: 'relative' }}>
                              <Box 
                                sx={{ 
                                  height: `${Math.max(30, stage.value * 3)}px`, 
                                  width: '60%', 
                                  bgcolor: index === 0 ? '#4CAF50' : 
                                         index === 1 ? '#2196F3' : 
                                         index === 2 ? '#FF9800' : 
                                         index === 3 ? '#9C27B0' :
                                         index === 4 ? '#E91E63' : '#F44336', 
                                  mx: 'auto',
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'height 0.3s'
                                }} 
                              />
                              <Typography variant="h6" fontWeight="bold">
                                {stage.value}
                              </Typography>
                            </Box>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              {stage.stage}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Side Panel */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Quick Actions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button 
                          component={Link}
                          to="/employees"
                          variant="contained" 
                          startIcon={<Add />} 
                          fullWidth 
                          sx={{ mb: 2, py: 1 }}
                        >
                          Add Employee
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button 
                          component={Link}
                          to="/payroll"
                          variant="contained" 
                          startIcon={<AttachMoney />} 
                          fullWidth 
                          sx={{ mb: 2, py: 1 }}
                        >
                          Process Payroll
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button 
                          component={Link}
                          to="/recruitment"
                          variant="contained" 
                          startIcon={<Work />} 
                          fullWidth
                          sx={{ py: 1 }}
                        >
                          Post Job
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button 
                          component={Link}
                          to="/employees"
                          variant="contained" 
                          startIcon={<Person />} 
                          fullWidth
                          sx={{ py: 1 }}
                        >
                          View Employees
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Department Distribution */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Department Distribution
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, height: 180 }}>
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <SimplePieChart data={departmentStats} />
                      )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {departmentStats.map((dept, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            bgcolor: dept.color,
                            mr: 1 
                          }} />
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            {dept.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dept.value} employee{dept.value !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Zoom>
    </Box>
  );
}

export default Home;

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Zoom, TextField, Grid, 
  Paper, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Divider, InputAdornment
} from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

function Payroll() {
  const [show, setShow] = useState(false);
  const [payrollData, setPayrollData] = useState({
    monthlySalary: 0,
    nonTaxableAllowance: 0,
    absences: 0,
    lateMinutes: 0,
    overtimeHours: 0
  });
  const [calculation, setCalculation] = useState({
    dailyRate: 0,
    hourlyRate: 0,
    absencesDeduction: 0,
    lateDeduction: 0,
    overtimePay: 0,
    sssContribution: 0,
    philHealthContribution: 0,
    pagIbigContribution: 0,
    incomeTax: 0,
    totalDeductions: 0,
    nonTaxableAllowance: 0,
    netPay: 0
  });

  useEffect(() => {
    setShow(true);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPayrollData({
      ...payrollData,
      [name]: parseFloat(value) || 0
    });
  };

  // Updated SSS contribution calculation based on the table from the image
  const calculateSSSContribution = (monthlySalary) => {
    // SSS Contribution Table based on the image provided
    if (monthlySalary < 3250) return 135;
    
    // Define ranges based on the contribution table from the image
    const ranges = [
      { min: 1, max: 5250.00, contribution: 250.00 },
     { min: 5250.01, max: 5749.00, contribution: 275.00 },
     { min: 5750.00, max: 6249.00, contribution: 300.00 },
     { min: 6250.00, max: 6749.00, contribution: 325.00 },
     { min: 6750.00, max: 7249.00, contribution: 350.00 },
     { min: 7250.00, max: 7749.00, contribution: 375.00 },
     { min: 7750.00, max: 8249.00, contribution: 400.00 },
     { min: 8250.00, max: 8749.00, contribution: 425.00 },
     { min: 8750.00, max: 9249.00, contribution: 450.00 },
     { min: 9250.00, max: 9749.00, contribution: 475.00 },
     { min: 9750.00, max: 10249.00, contribution: 500.00 },
     { min: 10250.00, max: 10749.00, contribution: 525.00 },
     { min: 10750.00, max: 11249.00, contribution: 550.00 },
     { min: 11250.00, max: 11749.00, contribution: 575.00 },
     { min: 11750.00, max: 12249.00, contribution: 600.00 },
     { min: 12250.00, max: 12749.00, contribution: 625.00 },
     { min: 12750.00, max: 13249.00, contribution: 650.00 },
     { min: 13250.00, max: 13749.00, contribution: 675.00 },
     { min: 13750.00, max: 14249.00, contribution: 700.00 },
     { min: 14250.00, max: 14749.00, contribution: 725.00 },
     { min: 14750.00, max: 15249.00, contribution: 750.00 },
     { min: 15250.00, max: 15749.00, contribution: 775.00 },
     { min: 15750.00, max: 16249.00, contribution: 800.00 },
     { min: 16250.00, max: 16749.00, contribution: 825.00 },
     { min: 16750.00, max: 17249.00, contribution: 850.00 },
     { min: 17250.00, max: 17749.00, contribution: 875.00 },
     { min: 17750.00, max: 18249.00, contribution: 900.00 },
     { min: 18250.00, max: 18749.00, contribution: 925.00 },
     { min: 18750.00, max: 19249.00, contribution: 950.00 },
     { min: 19250.00, max: 19749.00, contribution: 975.00 },
     { min: 19750.00, max: 20249.00, contribution: 1000.00 },
     { min: 20250.00, max: 20749.00, contribution: 1025.00 },
     { min: 20750.00, max: 21249.00, contribution: 1050.00 },
     { min: 21250.00, max: 21749.00, contribution: 1075.00 },
     { min: 21750.00, max: 22249.00, contribution: 1100.00 },
     { min: 22250.00, max: 22749.00, contribution: 1125.00 },
     { min: 22750.00, max: 23249.00, contribution: 1150.00 },
     { min: 23250.00, max: 23749.00, contribution: 1175.00 },
     { min: 23750.00, max: 24249.00, contribution: 1200.00 },
     { min: 24250.00, max: 24749.00, contribution: 1225.00 },
     { min: 24750.00, max: 25249.00, contribution: 1250.00 },
     { min: 25250.00, max: 25749.00, contribution: 1275.00 },
     { min: 25750.00, max: 26249.00, contribution: 1300.00 },
     { min: 26250.00, max: 26749.00, contribution: 1325.00 },
     { min: 26750.00, max: 27249.00, contribution: 1350.00 },
     { min: 27250.00, max: 27749.00, contribution: 1375.00 },
     { min: 27750.00, max: 28249.00, contribution: 1400.00 },
     { min: 28250.00, max: 28749.00, contribution: 1425.00 },
     { min: 28750.00, max: 29249.00, contribution: 1450.00 },
     { min: 29250.00, max: 29749.00, contribution: 1475.00 },
     { min: 29750.00, max: 30249.00, contribution: 1500.00 },
     { min: 30250.00, max: 30749.00, contribution: 1525.00 },
     { min: 30750.00, max: 31249.00, contribution: 1550.00 },
     { min: 31250.00, max: 31749.00, contribution: 1575.00 },
     { min: 31750.00, max: 32249.00, contribution: 1600.00 },
     { min: 32250.00, max: 32749.00, contribution: 1625.00 },
     { min: 32750.00, max: 33249.00, contribution: 1650.00 },
     { min: 33250.00, max: 33749.00, contribution: 1675.00 },
     { min: 33750.00, max: 34249.00, contribution: 1700.00 },
     { min: 34250.00, max: 99999.00, contribution: 1725.00 },

    ];
    
    // Find the appropriate range and return the contribution
    for (const range of ranges) {
      if (monthlySalary >= range.min && monthlySalary <= range.max) {
        return range.contribution;
      }
    }
    
    return 1125; // Default to max if not found within defined ranges
  };

  // Calculate PhilHealth contribution (updated to match expected results)
  const calculatePhilHealthContribution = (monthlySalary) => {
    // 5% of monthly salary divided by 2
    const rate = 0.05;
    const contribution = (monthlySalary * rate) / 2;
    return contribution;
  };

  // Pag-IBIG contribution
  const calculatePagIbigContribution = () => {
    return 200; // Set to 100 pesos for semi-monthly
  };

  // Simplified income tax calculation
  const calculateIncomeTax = (monthlySalary, sssContribution, philHealthContribution, pagIbigContribution) => {
    // Calculate taxable income
    const monthlySalarySemiMonthly = monthlySalary / 2;
    const totalContributions = sssContribution + philHealthContribution + pagIbigContribution;
    const taxableIncome = monthlySalarySemiMonthly - totalContributions;

    // Apply tax brackets
    if (taxableIncome <= 10417) { 
      return 0;
    } else if (taxableIncome <= 16667) { 
      return (taxableIncome - 10417) * 0.20;
    } else if (taxableIncome <= 33333) { 
      return 1250 + (taxableIncome - 16667) * 0.25;
    } else if (taxableIncome <= 83333) { 
      return 5416.50 + (taxableIncome - 33333) * 0.30;
    } else if (taxableIncome <= 333333) { 
      return 20416.50 + (taxableIncome - 83333) * 0.32;
    } else {
      return 100416.50 + (taxableIncome - 333333) * 0.35;
    }
  };

  const calculatePayroll = () => {
    // Basic salary computation for semi-monthly
    const semiMonthlyGross = payrollData.monthlySalary / 2;
    const semiMonthlyNonTaxable = payrollData.nonTaxableAllowance;
    const dailyRate = payrollData.monthlySalary / 26; // Using 26 days per month
    const hourlyRate = dailyRate / 8;
    
    // Attendance-based adjustments
    const absencesDeduction = payrollData.absences * dailyRate;
    const lateDeduction = (payrollData.lateMinutes / 60) * hourlyRate;
    const overtimeRate = payrollData.monthlySalary / 26 / 8 * 1.25; // Overtime rate formula
    const overtimePay = payrollData.overtimeHours * overtimeRate;
    
    // Calculate government mandatory deductions
    // For semi-monthly, divide monthly contributions by 2
    const sssContribution = calculateSSSContribution(payrollData.monthlySalary) ;
    const philHealthContribution = calculatePhilHealthContribution(payrollData.monthlySalary); // Already divided by 2 in the function
    const pagIbigContribution = calculatePagIbigContribution();
    
    // Calculate income tax after all other deductions
    const incomeTax = calculateIncomeTax(
      payrollData.monthlySalary, 
      sssContribution, 
      philHealthContribution, 
      pagIbigContribution
    );
    
    // Total deductions
    const totalDeductions = absencesDeduction + lateDeduction + 
                           sssContribution + philHealthContribution + 
                           pagIbigContribution + incomeTax;
    
    // Net pay calculation - add semi-monthly gross, non-taxable allowance, overtime pay, then subtract deductions
    const netPay = semiMonthlyGross + semiMonthlyNonTaxable + overtimePay - totalDeductions;
    
    setCalculation({
      dailyRate,
      hourlyRate,
      absencesDeduction,
      lateDeduction,
      overtimePay,
      sssContribution,
      philHealthContribution,
      pagIbigContribution,
      incomeTax,
      totalDeductions,
      nonTaxableAllowance: semiMonthlyNonTaxable,
      netPay
    });
  };

  return (
    <Box sx={{ flexGrow: 3 }}>
      <ResponsiveAppBar />
      <Zoom in={show} timeout={301}>
        <Container sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Payroll Management
          </Typography>
          <Typography variant="body1" paragraph>
           payroll hahahahaha antok nako hahaha
          </Typography>
          
          <Grid container spacing={3}>
            {/* Input Form */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Employee Payroll Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Monthly Salary"
                      name="monthlySalary"
                      type="number"
                      value={payrollData.monthlySalary || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Non-Taxable Allowance"
                      name="nonTaxableAllowance"
                      type="number"
                      value={payrollData.nonTaxableAllowance || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Absences (days)"
                      name="absences"
                      type="number"
                      value={payrollData.absences || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Late (minutes)"
                      name="lateMinutes"
                      type="number"
                      value={payrollData.lateMinutes || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Overtime (hours)"
                      name="overtimeHours"
                      type="number"
                      value={payrollData.overtimeHours || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={calculatePayroll}
                    >
                      Calculate Payroll
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Calculations and Results  remove IncomeTax soon*/}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payroll Computation results
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount (₱)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Daily Rate</TableCell>
                        <TableCell align="right">{calculation.dailyRate.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hourly Rate</TableCell>
                        <TableCell align="right">{calculation.hourlyRate.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="subtitle2">Deductions</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Absences</TableCell>
                        <TableCell align="right">{calculation.absencesDeduction.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Late</TableCell>
                        <TableCell align="right">{calculation.lateDeduction.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SSS</TableCell>
                        <TableCell align="right">{calculation.sssContribution.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PhilHealth</TableCell>
                        <TableCell align="right">{calculation.philHealthContribution.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pag-IBIG</TableCell>
                        <TableCell align="right">{calculation.pagIbigContribution.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Income Tax</TableCell> 
                        <TableCell align="right">{calculation.incomeTax.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Monthly Deductions</TableCell>
                        <TableCell align="right">{calculation.totalDeductions.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="subtitle2">Additions</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Non-Taxable Allowance</TableCell>
                        <TableCell align="right">{calculation.nonTaxableAllowance.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Overtime Pay</TableCell>
                        <TableCell align="right">{calculation.overtimePay.toFixed(2)}</TableCell>
                      </TableRow>
                      <Divider />
                      <TableRow>
                        <TableCell><strong>Semi-Monthly Net Pay</strong></TableCell>
                        <TableCell align="right"><strong>{calculation.netPay.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Zoom>
    </Box>
  );
}

export default Payroll;
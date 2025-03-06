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
    if (monthlySalary < 3250) return 135; // Minimum
    
    // Define ranges based on the contribution table from the image
    const ranges = [
      { min: 1, max: 5250.00, contribution: 250.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: .00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 1, max: 5250.00, contribution: 250.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 1, max: 5250.00, contribution: 250.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 1, max: 5250.00, contribution: 250.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 1, max: 5250.00, contribution: 250.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 1, max: 5250.00, contribution: 250.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },
     { min: 5250.01, max: 7250.00, contribution: 300.00 },

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
    // 2.75% based on the requirements (may need to adjust)
    const rate = 0.0275;
    const contribution = monthlySalary * rate;
    // Cap contribution if needed
    const maxContribution = 1500 * rate;
    
    return Math.min(contribution, maxContribution);
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
    if (taxableIncome <= 10417) { // 250,000 annually / 24 semi-monthly periods
      return 0;
    } else if (taxableIncome <= 16667) { // 400,000 annually / 24
      return (taxableIncome - 10417) * 0.20;
    } else if (taxableIncome <= 33333) { // 800,000 annually / 24
      return 1250 + (taxableIncome - 16667) * 0.25;
    } else if (taxableIncome <= 83333) { // 2,000,000 annually / 24
      return 5416.50 + (taxableIncome - 33333) * 0.30;
    } else if (taxableIncome <= 333333) { // 8,000,000 annually / 24
      return 20416.50 + (taxableIncome - 83333) * 0.32;
    } else {
      return 100416.50 + (taxableIncome - 333333) * 0.35;
    }
  };

  const calculatePayroll = () => {
    // Basic salary computation for semi-monthly
    const semiMonthlyGross = payrollData.monthlySalary / 2;
    const semiMonthlyNonTaxable = payrollData.nonTaxableAllowance / 2;
    const dailyRate = payrollData.monthlySalary / 22; // Using 22 working days per month
    const hourlyRate = dailyRate / 8;
    
    // Attendance-based adjustments
    const absencesDeduction = payrollData.absences * dailyRate;
    const lateDeduction = (payrollData.lateMinutes / 60) * hourlyRate;
    const overtimePay = payrollData.overtimeHours * hourlyRate * 1.25;
    
    // Calculate government mandatory deductions
    // For semi-monthly, divide monthly contributions by 2
    const sssContribution = calculateSSSContribution(payrollData.monthlySalary) / 2;
    const philHealthContribution = calculatePhilHealthContribution(payrollData.monthlySalary) / 2;
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
            Manage your company's payroll efficiently with automatic SSS, PhilHealth and Pag-IBIG deductions.
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
            
            {/* Calculations and Results */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payroll Calculation Results
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
                        <TableCell>SSS Contribution</TableCell>
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
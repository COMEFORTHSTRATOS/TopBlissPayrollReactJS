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
      { min: 3250, max: 3749.99, contribution: 157.50 },
      { min: 3750, max: 4249.99, contribution: 180.00 },
      { min: 4250, max: 4749.99, contribution: 202.50 },
      { min: 4750, max: 5249.99, contribution: 225.00 },
      { min: 5250, max: 5749.99, contribution: 247.50 },
      { min: 5750, max: 6249.99, contribution: 270.00 },
      { min: 6250, max: 6749.99, contribution: 292.50 },
      { min: 6750, max: 7249.99, contribution: 315.00 },
      { min: 7250, max: 7749.99, contribution: 337.50 },
      { min: 7750, max: 8249.99, contribution: 360.00 },
      { min: 8250, max: 8749.99, contribution: 382.50 },
      { min: 8750, max: 9249.99, contribution: 405.00 },
      { min: 9250, max: 9749.99, contribution: 427.50 },
      { min: 9750, max: 10249.99, contribution: 450.00 },
      { min: 10250, max: 10749.99, contribution: 472.50 },
      { min: 10750, max: 11249.99, contribution: 495.00 },
      { min: 11250, max: 11749.99, contribution: 517.50 },
      { min: 11750, max: 12249.99, contribution: 540.00 },
      { min: 12250, max: 12749.99, contribution: 562.50 },
      { min: 12750, max: 13249.99, contribution: 585.00 },
      { min: 13250, max: 13749.99, contribution: 607.50 },
      { min: 13750, max: 14249.99, contribution: 630.00 },
      { min: 14250, max: 14749.99, contribution: 652.50 },
      { min: 14750, max: 15249.99, contribution: 675.00 },
      { min: 15250, max: 15749.99, contribution: 697.50 },
      { min: 15750, max: 16249.99, contribution: 720.00 },
      { min: 16250, max: 16749.99, contribution: 742.50 },
      { min: 16750, max: 17249.99, contribution: 765.00 },
      { min: 17250, max: 17749.99, contribution: 787.50 },
      { min: 17750, max: 18249.99, contribution: 810.00 },
      { min: 18250, max: 18749.99, contribution: 832.50 },
      { min: 18750, max: 19249.99, contribution: 855.00 },
      { min: 19250, max: 19749.99, contribution: 877.50 },
      { min: 19750, max: 20249.99, contribution: 900.00 },
      { min: 20250, max: 20749.99, contribution: 922.50 },
      { min: 20750, max: 21249.99, contribution: 945.00 },
      { min: 21250, max: 21749.99, contribution: 967.50 },
      { min: 21750, max: 22249.99, contribution: 990.00 },
      { min: 22250, max: 22749.99, contribution: 1012.50 },
      { min: 22750, max: 23249.99, contribution: 1035.00 },
      { min: 23250, max: 23749.99, contribution: 1057.50 },
      { min: 23750, max: 24249.99, contribution: 1080.00 },
      { min: 24250, max: 24749.99, contribution: 1102.50 },
      { min: 24750, max: 25249.99, contribution: 1125.00 },
      // Additional ranges from the image
      { min: 25250, max: 29749.99, contribution: 1147.50 }
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
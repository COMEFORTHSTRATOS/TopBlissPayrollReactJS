import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logo from '../assets/logobliss.png'; // Adjust the path to your logo

// Register a standard PDF font that is formal and reliable
Font.register({
  family: 'Times-Roman',
  fontWeight: 'normal',
});

Font.register({
  family: 'Times-Bold',
  fontWeight: 'bold',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 10, // Further reduced padding
    fontFamily: 'Times-Roman',
    // Updated to standard 4x6 inch size (288x432 points)
    width: '288',
    height: '432'
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 5, // Smaller margin
    alignItems: 'center'
  },
  logo: {
    width: 30, // Even smaller logo
    height: 30,
    marginRight: 3
  },
  headerText: {
    flexGrow: 1,
    fontSize: 12, // Smaller font
    textAlign: 'center',
    fontFamily: 'Times-Bold'
  },
  section: {
    margin: 2, // Minimal margin
    padding: 2, // Minimal padding
    flexGrow: 1
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5, // Thinner line
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 15 // Shorter rows
  },
  description: {
    width: '60%',
    fontSize: 7 // Smaller font
  },
  amount: {
    width: '40%',
    textAlign: 'right',
    fontSize: 7 // Smaller font
  },
  boldText: {
    fontFamily: 'Times-Bold'
  },
  employeeInfo: {
    fontSize: 8, // Smaller font
    marginBottom: 1
  },
  sectionHeader: {
    marginTop: 5, 
    marginBottom: 2, 
    fontSize: 8,
    fontFamily: 'Times-Bold'
  },
  totalRow: {
    marginTop: 5, 
    borderTopWidth: 0.5, // Thinner line
    borderBottomWidth: 0
  }
});

const formatAmount = (amount) => {
  // Handle undefined, null, or zero
  if (!amount && amount !== 0) return '0.00';
  
  // Take absolute value and limit to 2 decimals
  const absValue = Math.abs(Number(amount));
  const formattedValue = absValue.toFixed(2);
  
  // Split number by decimal point
  const [whole, decimal] = formattedValue.split('.');
  
  // Add commas for thousands
  let formattedWhole = '';
  for (let i = 0; i < whole.length; i++) {
    if (i > 0 && (whole.length - i) % 3 === 0) {
      formattedWhole += ',';
    }
    formattedWhole += whole[i];
  }
  
  return `${formattedWhole}.${decimal}`;
};

const PayrollPDF = ({ employeeName, payrollData, calculation }) => {
  // Calculate the basic pay (semi-monthly gross) with absences and lates deducted
  const basicPay = (payrollData.monthlySalary / 2) - calculation.absencesDeduction - calculation.lateDeduction;
  
  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={styles.headerContainer}>
          <Image 
            style={styles.logo}
            src={logo}
          />
          <Text style={styles.headerText}>Payroll Summary</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.employeeInfo}>Employee Name: {employeeName}</Text>
          <Text style={styles.employeeInfo}>Monthly Salary: {formatAmount(payrollData.monthlySalary)}</Text>
          
          <Text style={styles.sectionHeader}>Earnings:</Text>
          <View style={styles.row}>
            <Text style={styles.description}>Basic Pay (After Absences & Lates):</Text>
            <Text style={styles.amount}>{formatAmount(basicPay)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Non-Taxable Allowance:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.nonTaxableAllowance)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Overtime Pay:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.overtimePay)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Night Differential Pay:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.nightDifferentialPay)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Special Holiday Pay:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.specialHolidayPay)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Sick Leave Pay:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.sickLeavePay)}</Text>
          </View>
          
          <Text style={styles.sectionHeader}>Deductions:</Text>
          <View style={styles.row}>
            <Text style={styles.description}>Absences:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.absencesDeduction)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Late:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.lateDeduction)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>SSS:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.sssContribution)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>PhilHealth:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.philHealthContribution)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Pag-IBIG:</Text>
            <Text style={styles.amount}>{formatAmount(calculation.pagIbigContribution)}</Text>
          </View>
          
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.description, { fontFamily: 'Times-Bold' }]}>Semi-Monthly Net Pay:</Text>
            <Text style={[styles.amount, { fontFamily: 'Times-Bold' }]}>{formatAmount(calculation.netPay)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PayrollPDF;

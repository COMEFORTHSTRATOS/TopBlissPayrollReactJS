import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../assets/logobliss.png'; // Adjust the path to your logo

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10
  },
  headerText: {
    flexGrow: 1,
    fontSize: 20,
    textAlign: 'center'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 24
  },
  description: {
    width: '60%'
  },
  amount: {
    width: '40%',
    textAlign: 'right'
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

const PayrollPDF = ({ employeeName, payrollData, calculation }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <Image 
          style={styles.logo}
          src={logo} // Using the imported logo variable
        />
        <Text style={styles.headerText}>Payroll Summary</Text>
      </View>
      <View style={styles.section}>
        <Text>Employee Name: {employeeName}</Text>
        <Text>Monthly Salary: {formatAmount(payrollData.monthlySalary)}</Text>
        
        <View style={styles.row}>
          <Text style={styles.description}>Daily Rate:</Text>
          <Text style={styles.amount}>{formatAmount(calculation.dailyRate)}</Text>
        </View>
        
        <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>Deductions:</Text>
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
        
        <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>Additions:</Text>
        <View style={styles.row}>
          <Text style={styles.description}>Non-Taxable Allowance:</Text>
          <Text style={styles.amount}>{formatAmount(calculation.nonTaxableAllowance)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.description}>Overtime Pay:</Text>
          <Text style={styles.amount}>{formatAmount(calculation.overtimePay)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.description}>Sick Leave Pay:</Text>
          <Text style={styles.amount}>{formatAmount(calculation.sickLeavePay)}</Text>
        </View>
        
        <View style={[styles.row, { marginTop: 20, borderTopWidth: 2 }]}>
          <Text style={[styles.description, { fontWeight: 'bold' }]}>Semi-Monthly Net Pay:</Text>
          <Text style={[styles.amount, { fontWeight: 'bold' }]}>{formatAmount(calculation.netPay)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PayrollPDF;

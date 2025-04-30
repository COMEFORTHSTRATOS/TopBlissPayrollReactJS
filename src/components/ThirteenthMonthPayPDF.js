import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logo from '../assets/logobliss.png'; // Adjust the path to your logo
import { formatCurrency } from '../utils/numberFormat';

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
  },
  subheaderText: {
    fontSize: 10, 
    textAlign: 'center', 
    marginBottom: 5
  },
  dateText: {
    fontSize: 8, 
    textAlign: 'center', 
    marginBottom: 10
  },
  signatureRow: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#000000',
    height: 30
  },
  signatureLabel: {
    width: '40%',
    fontSize: 7,
    fontFamily: 'Times-Roman'
  },
  signatureLine: {
    width: '60%',
    fontSize: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    marginTop: 10
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 6,
    color: '#555555'
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

const ThirteenthMonthPayPDF = ({ employeeName, thirteenthMonthPay, currentDate }) => (
  <Document>
    <Page size={[288, 432]} style={styles.page}>
      <View style={styles.headerContainer}>
        <Image 
          style={styles.logo}
          src={logo}
        />
        <Text style={styles.headerText}>              TOP BLISS SOLUTIONS INC.</Text>
      </View>
      
      <Text style={styles.subheaderText}>13TH MONTH PAY SLIP</Text>
      <Text style={styles.dateText}>{currentDate}</Text>
      
      <View style={styles.section}>
        <Text style={styles.employeeInfo}>Employee Name: {employeeName}</Text>
        
        <Text style={styles.sectionHeader}>13TH MONTH COMPUTATION:</Text>
        
        <View style={styles.row}>
          <Text style={styles.description}>Total Basic Pay (Dec-Nov):</Text>
          <Text style={styles.amount}>{formatAmount(thirteenthMonthPay * 12)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.description}>Divided by 12 Months:</Text>
          <Text style={styles.amount}>÷ 12</Text>
        </View>
        
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.description, { fontFamily: 'Times-Bold' }]}>13th Month Pay Amount:</Text>
          <Text style={[styles.amount, { fontFamily: 'Times-Bold' }]}>{formatAmount(thirteenthMonthPay)}</Text>
        </View>
        
        <View style={{height: 50}} /> {/* Spacer */}
        
        <View style={styles.signatureRow}>
          <Text style={styles.signatureLabel}>Employee Signature:</Text>
          <View style={styles.signatureLine}></View>
        </View>
        
        <View style={styles.signatureRow}>
          <Text style={styles.signatureLabel}>Authorized Signature:</Text>
          <View style={styles.signatureLine}></View>
        </View>
      </View>
      
      <Text style={styles.footer}>
        This is an official document of TopBliss Solutions Inc. 13th Month Pay is granted in accordance with Presidential Decree No. 851.
      </Text>
    </Page>
  </Document>
);

export default ThirteenthMonthPayPDF;

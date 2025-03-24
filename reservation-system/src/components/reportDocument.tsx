import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import "../styles/reports.css";

// Add PDF styles
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#5c6bc0",
  },
  subheader: {
    fontSize: 16,
    marginBottom: 10,
    color: "#252525",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "flex",
    width: "auto",
    marginVertical: 10,
    border: "1px solid #252525",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #252525",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 5,
    flex: 1,
  },
});

// Create PDF Document component
interface ReportData {
  title: string;
  type: string;
  dateRange: string;
  generatedOn: string;
  summary: { label: string; value: string | number }[];
}

export const ReportDocument = ({ reportData }: { reportData: ReportData }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.header}>{reportData.title}</Text>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subheader}>Report Details</Text>
        <Text>Type: {reportData.type}</Text>
        <Text>Date Range: {reportData.dateRange}</Text>
        <Text>Generated On: {reportData.generatedOn}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subheader}>Summary</Text>
        <View style={pdfStyles.table}>
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
            <Text style={pdfStyles.tableCell}>Metric</Text>
            <Text style={pdfStyles.tableCell}>Value</Text>
          </View>
          {reportData.summary.map((item, index) => (
            <View style={pdfStyles.tableRow} key={index}>
              <Text style={pdfStyles.tableCell}>{item.label}</Text>
              <Text style={pdfStyles.tableCell}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

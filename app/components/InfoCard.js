import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InfoCard({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});

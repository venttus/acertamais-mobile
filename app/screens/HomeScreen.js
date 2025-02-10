import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Para ícones modernos
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../service/firebase";

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigation.navigate("LoginScreen");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "funcionarios", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          const companyDocRef = doc(db, "empresas", data.empresaId);
          const companyDoc = await getDoc(companyDocRef);

          if (companyDoc.exists()) {
            setCompanyName(companyDoc.data().nomeFantasia);
          } else {
            console.error("Empresa não encontrada no Firestore.");
          }
        } else {
          console.error("Usuário não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003DA5" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho com imagem de fundo e ícone de usuário */}
      <View style={styles.header}>
        <View style={styles.userIconContainer}>
          <Icon name="person" size={80} color="#FFF" style={styles.userIcon} />
        </View>
      </View>

      {/* Nome do usuário e empresa */}
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Bem-vindo, {userData?.nome || "Usuário"}!</Text>
        <Text style={styles.companyText}>{companyName || "Empresa não disponível"}</Text>
      </View>

      {/* Dashboard */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dashboardContainer}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>

          {/* Card de serviços contratados */}
          <View style={styles.dashboardCard}>
            <Icon name="work" size={24} color="#003DA5" style={styles.cardIcon} />
            <Text style={styles.dashboardLabel}>Serviços Contratados:</Text>
            <Text style={styles.dashboardInfo}>
              {userData?.servicosContratados > 0 ? userData?.servicosContratados : "0"}
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
  },
  loadingText: {
    fontSize: 18,
    color: "#003DA5",
    marginTop: 10,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },
  header: {
    height: 200,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.8,
  },
  userIconContainer: {
    backgroundColor: "#003DA5",
    padding: 20,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFF",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#003DA5",
    marginBottom: 5,
  },
  companyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dashboardContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#003DA5",
    marginBottom: 20,
    textAlign: "center",
  },
  dashboardCard: {
    backgroundColor: "#F4F7FC",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  cardIcon: {
    marginBottom: 10,
  },
  dashboardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  dashboardInfo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#003DA5",
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: "#003DA5",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
});
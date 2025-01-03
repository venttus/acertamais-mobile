import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { auth, db } from "../../service/firebase";
import Logo from "../components/Logo";

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigation.navigate("LoginScreen");
      return;
    }

    console.log(user)

    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userDocRef = doc(db, "funcionarios", user.uid);
        const userDoc = await getDoc(userDocRef);
        console.log(userDoc.exists())

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);

          // Fetch company data
          if (userData.empresaId) {
            const empresaDocRef = doc(db, "empresas", userData.empresaId);
            const empresaDoc = await getDoc(empresaDocRef);

            if (empresaDoc.exists()) {
              const empresaData = empresaDoc.data();
              setUserData((prevData) => ({
                ...prevData,
                empresa: empresaData.nomeFantasia,
                planoId: empresaData.planos,
              }));

              // Fetch plan data
              if (empresaData.planos) {
                const planoDocRef = doc(db, "planos", empresaData.planos);
                const planoDoc = await getDoc(planoDocRef);

                if (planoDoc.exists()) {
                  const planoData = planoDoc.data();
                  setUserData((prevData) => ({
                    ...prevData,
                    plano: planoData.nome,
                  }));
                } else {
                  console.error("Plano não encontrado no Firestore.");
                }
              }
            } else {
              console.error("Empresa não encontrada no Firestore.");
            }
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!user || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const imageUrl = `https://img1.niftyimages.com/8ddh/k8w5/t6n7?cpf=${encodeURIComponent(userData?.cpf || "")}&email=${encodeURIComponent(user.email || "")}&empresa=${encodeURIComponent(userData?.empresa || "")}&idade=${encodeURIComponent(userData?.idade || "")}&image=${encodeURIComponent(userData?.photoURL || "")}&name=${encodeURIComponent(userData?.nome || "")}&plano=${encodeURIComponent(userData?.plano || "")}&profissao=${encodeURIComponent(userData?.role || "")}`;

  // Handle image load state
  const handleImageLoad = () => setImageLoading(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo />
      </View>
      {/* Dynamic Image */}
      <View style={styles.imageContainer}>
        {/* Show loading spinner until the image is loaded */}
        {imageLoading && <ActivityIndicator size="large" color="#3A76F0" />}
        <Image
          source={{ uri: imageUrl }}
          style={[styles.dynamicImage]}
          onLoad={handleImageLoad}
          resizeMode="contain" // "contain" to avoid cutting the image
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
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
    color: "#8A8F9D",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
    padding: 20,
    justifyContent: "space-between", // Allow content to spread across the screen with space between
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, // Make sure the image container takes the available space
    marginBottom: 5, // Give some space between the image and button
  },
  dynamicImage: {
    width: "170%", // Ensure the image stretches to fill available width
    height: "100%", // Set dynamic height (60% of the screen height) to make the image larger
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E8EB",
    transform: [{ rotate: '90deg' }]
  },
  logoutButton: {
    backgroundColor: "#3A76F0",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20, // Give some space above the button
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  logoutText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  }
});

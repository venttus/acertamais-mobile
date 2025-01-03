import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { auth, db } from "../../service/firebase";
import Background from "../components/Background";
import Button from "../components/Button";
import Header from "../components/Header";
import Logo from "../components/Logo";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";



// Função para aplicar a máscara no CPF
const maskCPF = (value) => {
  return value
    .replace(/\D/g, "") // Remove tudo o que não for número
    .replace(/^(\d{3})(\d)/, "$1.$2") // Adiciona o primeiro ponto
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3") // Adiciona o segundo ponto
    .replace(/\.(\d{3})(\d)/, ".$1-$2") // Adiciona o hífen
    .replace(/-(\d{2})\d+$/, "-$1"); // Limita a quantidade de dígitos após o hífen
};

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigation.navigate("HomeScreen");
      return;
    }
  }, [user])

  const onLoginPressed = async () => {
    try {

      // Verifica se a senha foi preenchida
      if (!cpf.value) {
        setCpf({ ...cpf, error: "CPF não pode ser vazia" });
        return;
      }
      // Verifica se a senha foi preenchida
      if (!password.value) {
        setPassword({ ...password, error: "Senha não pode ser vazia" });
        return;
      }

      console.log(cpf, password)
      // Consulta a coleção "funcionarios" no Firestore
      const funcionariosRef = collection(db, "funcionarios");
      const q = query(funcionariosRef, where("cpf", "==", cpf.value));
      const querySnapshot = await getDocs(q);

      // Verifica se encontrou algum documento
      if (querySnapshot.empty) {
        setCpf({ ...cpf, error: "CPF não encontrado" });
        return;
      }

      const funcionario = querySnapshot.docs[0].data();

      // Verifica se o usuário tem o papel (role) "user"
      if (funcionario.role !== "user") {
        setCpf({ ...cpf, error: "Permissão negada" });
        return;
      }

      // Autentica o usuário no Firebase Auth
      await signInWithEmailAndPassword(auth, funcionario.email, password.value);

      // Redireciona para a tela inicial
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
    } catch (error) {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        setPassword({ ...password, error: "Senha incorreta" });
      } else if (error.code === "auth/user-not-found") {
        setCpf({ ...cpf, error: "Usuário não encontrado" });
      } else {
        setCpf({ ...cpf, error: "Erro ao tentar acessar a conta" });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Background>
        <Logo />
        <Header>Acessar conta</Header>

        {/* Campo CPF com máscara */}
        <TextInput
          label="CPF"
          returnKeyType="next"
          value={cpf.value}
          onChangeText={(text) => setCpf({ value: maskCPF(text), error: "" })}
          error={!!cpf.error}
          errorText={cpf.error}
          autoCapitalize="none"
          keyboardType="number-pad"
          style={styles.textInput}  // Estilo aplicado
        />

        {/* Campo Senha */}
        <TextInput
          label="Senha"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          style={styles.textInput}  // Estilo aplicado
        />

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPasswordScreen")}
          >
            <Text style={styles.forgot}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={onLoginPressed}>
          Entrar
        </Button>
      </Background>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  textInput: {
    marginBottom: 12,  // Adicionando margem para separar os campos
  }
});

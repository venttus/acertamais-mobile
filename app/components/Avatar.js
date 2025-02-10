import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

export default function Avatar({ source, name }) {
  // Se source estiver vazio, renderiza as iniciais dos dois primeiros nomes
  const renderAvatar = () => {
    if (source) {
      return <Image source={source} style={styles.avatar} />;
    }

    // Gera as iniciais dos dois primeiros nomes
    const nameParts = name.split(" ");
    const initials = nameParts
      .slice(0, 2) // Pega apenas os dois primeiros nomes
      .map((word) => word[0].toUpperCase()) // Pega a primeira letra de cada
      .join("");

    return (
      <View style={styles.avatarContainer}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    );
  };

  return renderAvatar();
}

const styles = StyleSheet.create({
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3A76F0", // Cor de fundo para as iniciais
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  initials: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF", // Cor das iniciais
  },
});

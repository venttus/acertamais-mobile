import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para ícones modernos

export default function ServiceDetailsScreen({ route, navigation }) {
    const { service } = route.params; // Recebe os dados do serviço selecionado

    return (
        <ScrollView style={styles.container}>
            {/* Imagem do serviço */}
            <Image
                source={require("../../assets/items/business_logo.jpg")} // Substitua por uma imagem real
                style={styles.serviceImage}
            />

            {/* Nome do serviço */}
            <Text style={styles.serviceName}>{service.nome_servico}</Text>

            {/* Descrição do serviço */}
            <Text style={styles.serviceDescription}>{service.descricao}</Text>

            {/* Informações da empresa */}
            <View style={styles.infoContainer}>
                <Icon name="business" size={24} color="#003DA5" style={styles.icon} />
                <Text style={styles.infoText}>{service.empresa_nome}</Text>
            </View>

            {/* Localização */}
            <View style={styles.infoContainer}>
                <Icon name="location-on" size={24} color="#003DA5" style={styles.icon} />
                <Text style={styles.infoText}>{service.localizacao}</Text>
            </View>

            {/* Preço */}
            <View style={styles.infoContainer}>
                <Icon name="attach-money" size={24} color="#003DA5" style={styles.icon} />
                <Text style={styles.infoText}>
                    {service.preco_com_desconto ? `R$ ${service.preco_com_desconto}` : `R$ ${service.preco_original}`}
                </Text>
            </View>

            {/* Botão para solicitar serviço */}
            <TouchableOpacity style={styles.actionButton} onPress={() => alert("Serviço solicitado com sucesso!")}>
                <Text style={styles.buttonText}>Solicitar Serviço</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F7FC',
    },
    serviceImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 20,
    },
    serviceName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#003DA5',
        marginBottom: 10,
    },
    serviceDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 18,
        color: '#333',
    },
    actionButton: {
        backgroundColor: '#003DA5',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
});
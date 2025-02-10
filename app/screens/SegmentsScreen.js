import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SegmentsScreen({ navigation }) {
    const segmentos = [
        { value: 'agronegocio', label: 'Agronegócio' },
        { value: 'alimentacao', label: 'Alimentação' },
        { value: 'artes_publicidade', label: 'Artes e Publicidade' },
        { value: 'automotivo', label: 'Automotivo' },
        { value: 'beleza_estetica', label: 'Beleza e Estética' },
        { value: 'comercio', label: 'Comércio' },
        { value: 'confeccoes', label: 'Confecções' },
        { value: 'construcao', label: 'Construção' },
        { value: 'consultoria', label: 'Consultoria' },
        { value: 'educacao', label: 'Educação' },
        { value: 'eletronicos', label: 'Eletrônicos' },
        { value: 'empresas_variadas', label: 'Empresas Variadas' },
        { value: 'financas', label: 'Finanças' },
        { value: 'hospedagem_turismo', label: 'Hospedagem e Turismo' },
        { value: 'industria', label: 'Indústria' },
        { value: 'logistica_transporte', label: 'Logística e Transporte' },
        { value: 'saude', label: 'Saúde' },
        { value: 'servicos_gerais', label: 'Serviços Gerais' },
        { value: 'tecnologia', label: 'Tecnologia' },
    ];

    return (
        <View style={styles.container}>
            {/* Título */}
            <Text style={styles.title}>Segmentos</Text>

            {/* ScrollView para permitir rolagem da lista */}
            <ScrollView contentContainerStyle={styles.segmentList}>
                {segmentos.map((segmento, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.segmentButton}
                        onPress={() => navigation.navigate('ServicesScreen', { segmento: segmento.value })}
                    >
                        <Text style={styles.segmentText}>{segmento.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    segmentList: {
        flexGrow: 1, // Permite que a lista cresça, mas sem ocupar espaço além da tela
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20, // Adiciona um pouco de espaço no final da lista
    },
    segmentButton: {
        backgroundColor: '#00AD99', // Cor de fundo dos itens
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 15,
        width: '80%', // Largura personalizada
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Sombra para dar destaque
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    segmentText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        textAlign: 'center',
    },
});

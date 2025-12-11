import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const MenuButton = ({ title, icon, onPress, primary = false, style }) => (
    <TouchableOpacity
        style={[styles.button, primary && styles.primaryButton, style]}
        onPress={onPress}
    >
        <Ionicons name={icon} size={24} color={primary ? "#000000" : COLORS.primary} />
        <Text style={[styles.buttonText, primary && styles.primaryButtonText]}>{title}</Text>
    </TouchableOpacity>
);

const HomeScreen = () => {
    const navigation = useNavigation();
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        if (!searchText.trim()) return;
        setSearchVisible(false);
        // Navigate to Focus with the query
        navigation.navigate('Focus', { initialReference: searchText.trim() });
        setSearchText('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.menu}>
                <MenuButton
                    title="Start Focus Mode"
                    icon="moon"
                    primary
                    onPress={() => navigation.navigate('Focus', { initialReference: null })}
                    style={{ width: '100%' }}
                />

                <MenuButton
                    title="Search Ayat (e.g. 2:255)"
                    icon="search"
                    onPress={() => setSearchVisible(true)}
                    style={{ width: '100%' }}
                />

                <MenuButton
                    title="Weekly Stats"
                    icon="stats-chart"
                    onPress={() => navigation.navigate('Stats')}
                    style={{ width: '100%' }}
                />

                <MenuButton
                    title="Feedback"
                    icon="logo-facebook"
                    onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61584998726486')}
                    style={{ width: '100%' }}
                />

                <MenuButton
                    title="Settings"
                    icon="settings-outline"
                    onPress={() => navigation.navigate('Settings')}
                    style={{ width: '100%' }}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    "Idle for 30s to auto-start Focus"
                </Text>
            </View>

            {/* Search Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={searchVisible}
                onRequestClose={() => setSearchVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSearchVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Search Ayat</Text>
                        <Text style={styles.modalSubtitle}>Enter Surah:Ayah (e.g. 2:255)</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="2:255"
                            placeholderTextColor={COLORS.textDim}
                            value={searchText}
                            onChangeText={setSearchText}
                            keyboardType="numbers-and-punctuation"
                            autoFocus
                        />

                        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                            <Text style={styles.searchBtnText}>Go to Ayat</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        height: 280,
        justifyContent: 'center',
    },
    logoImage: {
        width: 360,
        height: 260,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontFamily: 'System', // Replace with custom font if available
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.textDim,
        marginTop: SPACING.sm,
        letterSpacing: 2,
    },
    menu: {
        gap: SPACING.md,
        alignItems: 'center', // Center buttons
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.md,
        marginTop: SPACING.md,
        width: '100%',
    },
    button: {
        // flex: 1, // Removed to prevent vertical expansion issues
        backgroundColor: COLORS.bgLight,
        padding: SPACING.lg,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
        gap: SPACING.sm,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    buttonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButtonText: {
        color: "#000000", // High contrast Black
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    footerText: {
        color: COLORS.textDim,
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    modalContent: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 20,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    modalTitle: {
        color: COLORS.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    modalSubtitle: {
        color: COLORS.textDim,
        fontSize: 14,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: COLORS.textDim,
        borderRadius: 12,
        padding: SPACING.md,
        color: COLORS.text,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    searchBtn: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    searchBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;

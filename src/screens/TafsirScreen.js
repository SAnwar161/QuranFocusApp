import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTafsirV2 } from '../api/alquran';
import { COLORS, SPACING } from '../constants/theme';
import { useApp } from '../context/Store';
import { TAFSIR_EDITIONS } from '../constants/tafsir';

const TafsirScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { ayat } = route.params;
    const { settings, setSettings } = useApp();

    const [loading, setLoading] = useState(true);
    const [tafsir, setTafsir] = useState(null);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const currentTafsir = TAFSIR_EDITIONS.find(t => t.id === settings.tafsir) || TAFSIR_EDITIONS[0];

    const fetchTafsirData = async (tafsirSlug) => {
        if (!ayat) return;

        setLoading(true);
        setError(null);

        try {
            const surahNumber = ayat.surah?.number || ayat.surah;
            const ayahNumber = ayat.numberInSurah;

            console.log('Fetching tafsir for surah:', surahNumber, 'ayah:', ayahNumber, 'edition:', tafsirSlug);
            const data = await getTafsirV2(surahNumber, ayahNumber, tafsirSlug);

            if (data && data.text) {
                setTafsir(data.text);
            } else {
                setTafsir(null);
                setError("Tafsir not available for this Ayat in this edition.");
            }
        } catch (err) {
            console.error('Tafsir fetch error:', err);
            setTafsir(null);
            setError("Failed to load Tafsir. Please try another edition.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTafsirData(settings.tafsir);
    }, [ayat, settings.tafsir]);

    const selectTafsir = (tafsirId) => {
        setSettings(prev => ({ ...prev, tafsir: tafsirId }));
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tafsir</Text>
            </View>

            {/* Tafsir Selection */}
            <TouchableOpacity
                style={styles.tafsirSelector}
                onPress={() => setModalVisible(true)}
            >
                <View>
                    <Text style={styles.selectorLabel}>Tafsir Edition</Text>
                    <Text style={styles.selectorValue}>{currentTafsir.name} ({currentTafsir.language})</Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.ayatInfo}>
                    <Text style={styles.surahText}>
                        {ayat.surah?.englishName || 'Surah'} ({ayat.surah?.number || ''}:{ayat.numberInSurah})
                    </Text>
                    <Text style={styles.ayatText}>{ayat.text}</Text>
                    {ayat.translation && (
                        <Text style={styles.translationText}>{ayat.translation.text}</Text>
                    )}
                </View>

                <View style={styles.divider} />

                <Text style={styles.tafsirHeader}>📖 {currentTafsir.name} Commentary</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading Tafsir...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color={COLORS.textDim} />
                        <Text style={styles.errorText}>{error}</Text>
                        <Text style={styles.errorHint}>Try selecting a different Tafsir edition above.</Text>
                    </View>
                ) : (
                    <Text style={styles.tafsirText}>{tafsir}</Text>
                )}
            </ScrollView>

            {/* Tafsir Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Tafsir</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={TAFSIR_EDITIONS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.tafsirOption,
                                        settings.tafsir === item.id && styles.selectedOption
                                    ]}
                                    onPress={() => selectTafsir(item.id)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.tafsirName}>{item.name}</Text>
                                        <Text style={styles.tafsirLang}>{item.language}</Text>
                                    </View>
                                    {settings.tafsir === item.id &&
                                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                                    }
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    backBtn: {
        padding: SPACING.sm,
        marginRight: SPACING.sm,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    tafsirSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        padding: SPACING.md,
        backgroundColor: COLORS.bgLight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    selectorLabel: {
        color: COLORS.textDim,
        fontSize: 12,
    },
    selectorValue: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 50,
    },
    ayatInfo: {
        marginBottom: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: COLORS.bgLight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.secondary,
    },
    surahText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    ayatText: {
        color: COLORS.text,
        fontSize: 22,
        textAlign: 'center',
        lineHeight: 38,
        marginBottom: SPACING.sm,
    },
    translationText: {
        color: COLORS.textDim,
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.textDim,
        opacity: 0.3,
        marginBottom: SPACING.lg,
    },
    tafsirHeader: {
        color: COLORS.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
    },
    tafsirText: {
        color: COLORS.text,
        fontSize: 16,
        lineHeight: 28,
        textAlign: 'justify',
    },
    loadingContainer: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        color: COLORS.textDim,
        marginTop: SPACING.md,
    },
    errorContainer: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        color: COLORS.textDim,
        fontSize: 16,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    errorHint: {
        color: COLORS.primary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: SPACING.sm,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.bgLight,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    tafsirOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    selectedOption: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        marginHorizontal: -SPACING.lg,
        paddingHorizontal: SPACING.lg,
    },
    tafsirName: {
        color: COLORS.text,
        fontSize: 16,
    },
    tafsirLang: {
        color: COLORS.textDim,
        fontSize: 12,
        marginTop: 2,
    },
});

export default TafsirScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTafsir } from '../api/alquran';
import { COLORS, SPACING } from '../constants/theme';
import { useApp } from '../context/Store';

const TafsirScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { ayat } = route.params;
    const { settings } = useApp();

    const [loading, setLoading] = useState(true);
    const [tafsir, setTafsir] = useState(null);

    useEffect(() => {
        const fetchTafsir = async () => {
            if (!ayat) return;

            // Defaulting to Ibn Kathir (English) for now. 
            const edition = settings.translation && settings.translation.startsWith('ar') ? 'ar.moyassar' : 'en.ibnkathir';

            try {
                const data = await getTafsir(ayat.number, edition);
                setTafsir(data ? data.text : "Tafsir not available for this Ayat.");
            } catch (error) {
                setTafsir("Failed to load Tafsir.");
            } finally {
                setLoading(false);
            }
        };

        fetchTafsir();
    }, [ayat, settings.translation]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tafsir</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.ayatInfo}>
                    <Text style={styles.surahText}>
                        {ayat.surah.englishName} ({ayat.surah.number}:{ayat.numberInSurah})
                    </Text>
                    <Text style={styles.ayatText}>{ayat.text}</Text>
                </View>

                <View style={styles.divider} />

                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                ) : (
                    <Text style={styles.tafsirText}>{tafsir}</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50, // Status bar formatting
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
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
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'System', // Or custom font
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.textDim,
        opacity: 0.3,
        marginBottom: SPACING.lg,
    },
    tafsirText: {
        color: COLORS.text,
        fontSize: 16,
        lineHeight: 28,
        textAlign: 'justify',
    },
});

export default TafsirScreen;

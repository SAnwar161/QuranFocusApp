import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { getHijriDateWithLocation } from '../services/hijriDate';

const IslamicDateBanner = () => {
    const [hijriDate, setHijriDate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHijriDate();
    }, []);

    const fetchHijriDate = async () => {
        try {
            const date = await getHijriDateWithLocation();
            setHijriDate(date);
        } catch (error) {
            console.error('Failed to fetch Hijri date:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    }

    if (!hijriDate) {
        return null; // Don't show if failed to load
    }

    return (
        <View style={styles.container}>
            {/* Country Flag */}
            <Text style={styles.flag}>{hijriDate.flag}</Text>

            <View style={styles.iconContainer}>
                <Ionicons name="moon-outline" size={18} color={COLORS.primary} />
            </View>

            <View style={styles.dateContainer}>
                <Text style={styles.arabicDate}>{hijriDate.fullDateArabic}</Text>
                <Text style={styles.englishDate}>
                    {hijriDate.fullDate}
                    {hijriDate.city && ` • ${hijriDate.city}`}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.bgLight,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(212, 175, 55, 0.2)',
        gap: SPACING.sm,
    },
    flag: {
        fontSize: 20,
    },
    iconContainer: {
        marginRight: 4,
    },
    dateContainer: {
        alignItems: 'center',
    },
    arabicDate: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: '600',
    },
    englishDate: {
        color: COLORS.textDim,
        fontSize: 11,
        marginTop: 2,
    },
});

export default IslamicDateBanner;

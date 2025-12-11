import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Platform, Image } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { height } = Dimensions.get('window');

const AyatCard = ({ ayat, translation, fontSize = 28 }) => {
    if (!ayat || !ayat.text) return null;

    // Simple heuristic for font scaling
    const textLength = ayat.text.length;
    let dynamicFontSize = fontSize * 1.4; // Reduced from 1.6

    if (textLength > 300) {
        dynamicFontSize = fontSize * 0.85; // Massive reduction for very long verses
    } else if (textLength > 150) {
        dynamicFontSize = fontSize * 1.0;
    } else if (textLength > 80) {
        dynamicFontSize = fontSize * 1.2;
    }

    // Arabic needs generous line height. Usually 1.5x to 2.0x the font size.
    let dynamicLineHeight = dynamicFontSize * 1.7;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.surahInfo}>
                    {ayat.surah ? `${ayat.surah.englishName} (${ayat.surah.number}:${ayat.numberInSurah})` : ''}
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                indicatorStyle="white"
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.arabicContainer}>
                    <Text style={[
                        styles.arabicText,
                        { fontSize: dynamicFontSize, lineHeight: dynamicLineHeight }
                    ]}>
                        {ayat.text}
                    </Text>
                </View>

                {translation && (
                    <View style={styles.translationContainer}>
                        <Text style={[styles.translationText, { fontSize: fontSize * 0.6 }]}>
                            {translation.text}
                        </Text>
                    </View>
                )}

                <View style={styles.brandingFooter}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.brandingLogo}
                        resizeMode="contain"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E1E1E', // Solid dark background for image capture
        borderRadius: 20,
        padding: SPACING.lg,
        marginVertical: SPACING.sm,
        marginHorizontal: SPACING.md,
        width: '90%',
        alignSelf: 'center',
        maxHeight: height * 0.95, // Further maximized
        // Attractive Card styling
        borderWidth: 2,
        borderColor: COLORS.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
        flex: 1,
    },
    scrollContent: {
        paddingBottom: SPACING.md,
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 4, // Avoid edge clipping
    },
    brandingFooter: {
        marginTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.2)',
        paddingTop: SPACING.sm,
        alignItems: 'center',
    },
    brandingLogo: {
        width: 220,
        height: 110,
    },
    header: {
        marginBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
        paddingBottom: SPACING.sm,
        flexShrink: 0,
    },
    surahInfo: {
        color: COLORS.accent,
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    arabicContainer: {
        marginBottom: SPACING.lg,
        alignItems: 'center',
        paddingVertical: SPACING.sm, // Extra vertical padding for glyphs
    },
    arabicText: {
        color: COLORS.text,
        // fontFamily: FONTS.arabic, // Reverting to System to ensure generic rendering is clean if custom font fails
        // or we can use a stack if React Native supported it in style strings directly like CSS, but it doesn't.
        // We'll rely on system font which usually handles Arabic well on native, 
        // but on Web it might default to Times New Roman if not careful.
        // Let's add specific web-style font family if platform is web
        ...Platform.select({
            web: { fontFamily: 'Amiri, Georgia, "Times New Roman", serif' },
            default: { fontFamily: FONTS.arabic },
        }),
        textAlign: 'center',
        fontWeight: '500', // Making it slightly bolder for clarity
    },
    translationContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: SPACING.md,
    },
    translationText: {
        color: COLORS.textDim,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 24,
    },
});

export default AyatCard;

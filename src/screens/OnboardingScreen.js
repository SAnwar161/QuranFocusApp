import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        icon: 'book-open-page-variant',
        iconType: 'material',
        title: 'Welcome to QuranFocus',
        bullets: [
            '☪️ Your daily spiritual companion',
            '📅 Hijri Date, Moon Phase & Flag',
            '🤲 Start your habit today',
        ],
    },
    {
        id: '2',
        icon: 'moon',
        iconType: 'ionicons',
        title: 'Focus Mode',
        bullets: [
            '🌙 Distraction-free random Ayats',
            '🎧 Audio with 5 Reciters',
            '🔍 Search any verse (e.g., "2:255")',
        ],
    },
    {
        id: '3',
        icon: 'timer-outline',
        iconType: 'ionicons',
        title: 'Smart Timer',
        bullets: [
            '⏱️ Auto-rotates Ayats (30s - 2m)',
            '💤 Idle for 30s? Auto-starts Focus',
            '🔄 Seamless spiritual flow',
        ],
    },
    {
        id: '4',
        icon: 'book-outline',
        iconType: 'ionicons',
        title: 'Read Al-Quran',
        bullets: [
            '📖 Complete Quran with Tilawat',
            '📜 Auto-scroll & Continuous Play',
            '🌍 Multiple Translations',
        ],
    },
    {
        id: '5',
        icon: 'star',
        iconType: 'ionicons',
        title: 'Bookmark Favorites',
        bullets: [
            '⭐ One-tap save in any mode',
            '🔖 Organize by Surah',
            '📚 Build your personal collection',
        ],
    },
    {
        id: '6',
        icon: 'notifications-outline',
        iconType: 'ionicons',
        title: 'Daily Reminders',
        bullets: [
            '⏰ Up to 10 Daily Reminders',
            '🏷️ Custom Labels (Fajr, Dhuhr...)',
            '📳 Gentle Vibration Alerts',
        ],
    },
    {
        id: '7',
        icon: 'library-outline',
        iconType: 'ionicons',
        title: 'In-App Tafsir',
        bullets: [
            '📘 7 Editions (Urdu, English, Arabic)',
            '🎓 Dr. Israr, Ibn Kathir, Jalalayn',
            '✨ Instant understanding of Ayats',
        ],
    },
    {
        id: '8',
        icon: 'stats-chart',
        iconType: 'ionicons',
        title: 'Track Your Journey',
        bullets: [
            '🔥 Daily Streak & Weekly Stats',
            '🏆 Track "Most Read Surah"',
            '🖼️ Share beautiful Ayat cards',
        ],
    },
];

const OnboardingScreen = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const renderIcon = (item) => {
        const iconProps = {
            size: 120,
            color: COLORS.primary,
        };

        if (item.iconType === 'material') {
            return <MaterialCommunityIcons name={item.icon} {...iconProps} />;
        } else if (item.iconType === 'fontawesome') {
            return <FontAwesome5 name={item.icon} {...iconProps} />;
        } else {
            return <Ionicons name={item.icon} {...iconProps} />;
        }
    };

    const renderSlide = ({ item }) => (
        <View style={styles.slide}>
            <ScrollView
                contentContainerStyle={styles.slideContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.iconContainer}>
                    {renderIcon(item)}
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.bulletContainer}>
                    {item.bullets.map((bullet, index) => (
                        <Text key={index} style={styles.bullet}>
                            {bullet}
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </View>
    );

    const renderPagination = () => (
        <View style={styles.pagination}>
            {slides.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index === currentIndex && styles.activeDot,
                    ]}
                />
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />

            {/* Pagination */}
            {renderPagination()}

            {/* Next/Done Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>
                    {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    skipText: {
        color: COLORS.textDim,
        fontSize: 16,
    },
    slide: {
        width: width,
        flex: 1,
    },
    slideContent: {
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: height * 0.08,
        paddingBottom: SPACING.lg,
    },
    iconContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: COLORS.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    title: {
        color: COLORS.primary,
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    bulletContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: SPACING.lg,
    },
    bullet: {
        color: COLORS.text,
        fontSize: 16,
        marginBottom: SPACING.sm,
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.bgLight,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 25,
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        marginHorizontal: SPACING.xl,
        marginBottom: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;

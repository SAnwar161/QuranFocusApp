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
            '☪️ Your daily companion for Quran reflection',
            '📱 Beautiful, distraction-free experience',
            '🤲 Start your spiritual journey today',
        ],
    },
    {
        id: '2',
        icon: 'moon',
        iconType: 'ionicons',
        title: 'Focus Mode',
        bullets: [
            '🌙 Random ayats displayed beautifully',
            '📜 Arabic text with translation side by side',
            '🧘 Designed for peaceful contemplation',
        ],
    },
    {
        id: '3',
        icon: 'timer-outline',
        iconType: 'ionicons',
        title: 'Smart Timer',
        bullets: [
            '⏱️ Auto-rotates new ayat every 60 seconds',
            '💤 Idle for 30s? Auto-starts Focus Mode',
            '🔄 Never miss your daily reflection',
        ],
    },
    {
        id: '4',
        icon: 'book-outline',
        iconType: 'ionicons',
        title: 'Read Al-Quran',
        bullets: [
            '📖 Browse all 114 Surahs',
            '🌍 Arabic text with multiple translations',
            '📜 Scroll through complete chapters',
        ],
    },
    {
        id: '5',
        icon: 'star',
        iconType: 'ionicons',
        title: 'Bookmark Favorites',
        bullets: [
            '⭐ Save favorites from Focus or Read mode',
            '🔖 Quick access to bookmarked ayats',
            '📚 Build your personal collection',
        ],
    },
    {
        id: '6',
        icon: 'notifications-outline',
        iconType: 'ionicons',
        title: 'Daily Reminders',
        bullets: [
            '⏰ Set up to 10 daily reminders',
            '🏷️ Custom labels (Fajr, Dhuhr, etc.)',
            '📳 Gentle vibration notifications',
        ],
    },
    {
        id: '7',
        icon: 'headphones',
        iconType: 'ionicons',
        title: 'Tafsir & Recitation',
        bullets: [
            '🎧 Listen to beautiful recitation',
            '📘 Read detailed tafsir explanations',
            '🔊 Immerse in the meaning',
        ],
    },
    {
        id: '8',
        icon: 'stats-chart',
        iconType: 'ionicons',
        title: 'Track & Share',
        bullets: [
            '📊 Track your weekly progress',
            '🖼️ Share beautiful ayat cards',
            '🎯 Stay motivated on your journey',
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


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/Store';
import { getBookmarks } from '../services/storage';
import { COLORS, SPACING } from '../constants/theme';
import { BarChart, ProgressChart } from 'react-native-chart-kit';

const SURAHS = require('../data/surahs.json');

const { width } = Dimensions.get('window');

const StatsScreen = () => {
    const { stats, resetStats } = useApp();
    const navigation = useNavigation();
    const [bookmarkCount, setBookmarkCount] = useState(0);

    // Load bookmarks count
    useEffect(() => {
        const loadBookmarks = async () => {
            const marks = await getBookmarks();
            setBookmarkCount(marks?.length || 0);
        };
        loadBookmarks();
    }, []);

    // Data for Progress Ring (Goal: 100 mins weekly focus)
    const focusGoal = 100;
    const focusProgress = Math.min(stats.focusMinutes / focusGoal, 1);

    // Data for Bar Chart (Activity breakdown) - now includes Tafsir
    const barData = {
        labels: ["Read", "Played", "Shared", "Tafsir"],
        datasets: [
            {
                data: [
                    stats.ayatsSeen || 0,
                    stats.ayatsListened || 0,
                    stats.ayatsShared || 0,
                    stats.tafsirRead || 0
                ]
            }
        ]
    };

    const chartConfig = {
        backgroundGradientFrom: COLORS.bgLight,
        backgroundGradientTo: COLORS.bgLight,
        color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
        decimalPlaces: 0,
    };

    // Calculate Most Read Surah
    const getMostReadSurah = () => {
        if (!stats.surahReadCounts || Object.keys(stats.surahReadCounts).length === 0) {
            return null;
        }
        const entries = Object.entries(stats.surahReadCounts);
        const [surahNum, count] = entries.reduce((max, curr) =>
            curr[1] > max[1] ? curr : max
        );
        const surah = SURAHS[parseInt(surahNum) - 1];
        return { surah, count };
    };

    const mostReadSurah = getMostReadSurah();

    // Calculate weekly improvement
    const getWeeklyImprovement = () => {
        const thisWeek = stats.weeklyStats?.thisWeek || { seen: 0, listened: 0, focus: 0 };
        const lastWeek = stats.weeklyStats?.lastWeek || { seen: 0, listened: 0, focus: 0 };

        const thisTotal = thisWeek.seen + thisWeek.listened + thisWeek.focus;
        const lastTotal = lastWeek.seen + lastWeek.listened + lastWeek.focus;

        if (lastTotal === 0) return { percentage: 0, isUp: true };

        const change = ((thisTotal - lastTotal) / lastTotal) * 100;
        return { percentage: Math.abs(Math.round(change)), isUp: change >= 0 };
    };

    const weeklyChange = getWeeklyImprovement();

    // Reset stats confirmation
    const handleResetStats = () => {
        Alert.alert(
            "Reset All Stats?",
            "This will clear all your progress data. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: () => {
                        resetStats();
                        Alert.alert("Done", "All stats have been reset.");
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
                    <Ionicons name="home-outline" size={24} color={COLORS.primary} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>Your Impact</Text>

                {/* Streak Banner */}
                {stats.currentStreak > 0 && (
                    <View style={styles.streakBanner}>
                        <Text style={styles.streakEmoji}>🔥</Text>
                        <View>
                            <Text style={styles.streakValue}>{stats.currentStreak} Day Streak!</Text>
                            <Text style={styles.streakSubtext}>Keep it going!</Text>
                        </View>
                    </View>
                )}

                {/* Weekly Progress Comparison */}
                <View style={styles.weeklyCard}>
                    <Text style={styles.chartTitle}>This Week vs Last Week</Text>
                    <View style={styles.weeklyRow}>
                        <Ionicons
                            name={weeklyChange.isUp ? "trending-up" : "trending-down"}
                            size={32}
                            color={weeklyChange.isUp ? "#4CAF50" : "#FF5722"}
                        />
                        <Text style={[
                            styles.weeklyPercentage,
                            { color: weeklyChange.isUp ? "#4CAF50" : "#FF5722" }
                        ]}>
                            {weeklyChange.percentage}% {weeklyChange.isUp ? "Up" : "Down"}
                        </Text>
                    </View>
                </View>

                {/* Focus Time Progress */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Focus Goal (Weekly)</Text>
                    <ProgressChart
                        data={{ labels: ["Focus"], data: [focusProgress] }}
                        width={width - SPACING.lg * 4}
                        height={160}
                        strokeWidth={16}
                        radius={60}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`, // Gold
                        }}
                        hideLegend={true}
                    />
                    <Text style={styles.progressText}>
                        {stats.focusMinutes} / {focusGoal} mins
                    </Text>
                </View>

                {/* Activity Bar Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Activity Breakdown</Text>
                    <BarChart
                        data={barData}
                        width={width - SPACING.lg * 2}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars
                        fromZero
                    />
                </View>

                {/* Most Read Surah */}
                {mostReadSurah && (
                    <View style={styles.mostReadCard}>
                        <Ionicons name="trophy-outline" size={28} color={COLORS.primary} />
                        <View style={styles.mostReadInfo}>
                            <Text style={styles.mostReadLabel}>Most Read Surah</Text>
                            <Text style={styles.mostReadSurah}>{mostReadSurah.surah.transliteration}</Text>
                            <Text style={styles.mostReadCount}>Opened {mostReadSurah.count} times</Text>
                        </View>
                    </View>
                )}

                {/* Detailed Stats Grid */}
                <View style={styles.grid}>
                    <View style={styles.statBox}>
                        <Ionicons name="book-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>{stats.ayatsSeen}</Text>
                        <Text style={styles.statLabel}>Read</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="musical-notes-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>{stats.ayatsListened}</Text>
                        <Text style={styles.statLabel}>Listened</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="share-social-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>{stats.ayatsShared || 0}</Text>
                        <Text style={styles.statLabel}>Shared</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="document-text-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>{stats.tafsirRead || 0}</Text>
                        <Text style={styles.statLabel}>Tafsir</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="time-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>{stats.focusMinutes}</Text>
                        <Text style={styles.statLabel}>Mins</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="bookmark-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>{bookmarkCount}</Text>
                        <Text style={styles.statLabel}>Bookmarks</Text>
                    </View>
                </View>

                {/* Reset Stats Button */}
                <TouchableOpacity style={styles.resetButton} onPress={handleResetStats}>
                    <Ionicons name="refresh-outline" size={20} color={COLORS.textDim} />
                    <Text style={styles.resetText}>Reset All Stats</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    topBar: {
        paddingTop: 50,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.sm,
        zIndex: 10,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        alignSelf: 'flex-start',
        padding: SPACING.sm,
        backgroundColor: COLORS.bgLight,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    backText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 50,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    streakBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: 16,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 152, 0, 0.5)',
    },
    streakEmoji: {
        fontSize: 36,
        marginRight: SPACING.md,
    },
    streakValue: {
        color: '#FF9800',
        fontSize: 20,
        fontWeight: 'bold',
    },
    streakSubtext: {
        color: COLORS.textDim,
        fontSize: 14,
    },
    weeklyCard: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 16,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        alignItems: 'center',
    },
    weeklyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    weeklyPercentage: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    chartCard: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 20,
        padding: SPACING.md,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    chartTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: SPACING.md,
        alignSelf: 'flex-start',
        marginLeft: SPACING.sm,
    },
    progressText: {
        color: COLORS.textDim,
        marginTop: -30,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    mostReadCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgLight,
        padding: SPACING.md,
        borderRadius: 16,
        marginBottom: SPACING.lg,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    mostReadInfo: {
        marginLeft: SPACING.md,
    },
    mostReadLabel: {
        color: COLORS.textDim,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    mostReadSurah: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    mostReadCount: {
        color: COLORS.textDim,
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statBox: {
        width: '48%',
        backgroundColor: COLORS.bgLight,
        padding: SPACING.md,
        borderRadius: 16,
        marginBottom: SPACING.md,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    statValue: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    statLabel: {
        color: COLORS.textDim,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        marginTop: SPACING.md,
        gap: SPACING.sm,
    },
    resetText: {
        color: COLORS.textDim,
        fontSize: 14,
    },
});

export default StatsScreen;

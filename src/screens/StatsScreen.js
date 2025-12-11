
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/Store';
import { COLORS, SPACING } from '../constants/theme';
import { BarChart, ProgressChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
    const { stats } = useApp();
    const navigation = useNavigation();

    // Data for Progress Ring (Goal: 60 mins focus)
    const focusGoal = 60;
    const focusProgress = Math.min(stats.focusMinutes / focusGoal, 1);

    // Data for Bar Chart (Activity breakdown)
    const barData = {
        labels: ["Read", "Played", "Shared"],
        datasets: [
            {
                data: [stats.ayatsSeen || 0, stats.ayatsListened || 0, stats.ayatsShared || 0]
            }
        ]
    };

    const chartConfig = {
        backgroundGradientFrom: COLORS.bgLight,
        backgroundGradientTo: COLORS.bgLight,
        color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        decimalPlaces: 0,
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

                {/* Focus Time Progress */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Focus Goal (Daily)</Text>
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
                        <Ionicons name="time-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>{stats.focusMinutes}</Text>
                        <Text style={styles.statLabel}>Mins</Text>
                    </View>
                </View>

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
        marginTop: -30, // Hack to overlay on center of ring if desired, or just below
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default StatsScreen;

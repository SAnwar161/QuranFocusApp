
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, FlatList, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/Store';
import { COLORS, SPACING } from '../constants/theme';
import { LANGUAGES } from '../constants/languages';
import { RECITERS } from '../constants/reciters';
import { TAFSIR_EDITIONS } from '../constants/tafsir';

const SettingItem = ({ label, value, onValueChange, type = 'switch' }) => (
    <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{label}</Text>
        {type === 'switch' && (
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: COLORS.bgLight, true: COLORS.primary }}
                thumbColor={COLORS.text}
            />
        )}
    </View>
);

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { settings, setSettings } = useApp();
    const [modalVisible, setModalVisible] = useState(false);
    const [reciterModalVisible, setReciterModalVisible] = useState(false);
    const [tafsirModalVisible, setTafsirModalVisible] = useState(false);

    const toggleNotification = (val) => {
        setSettings(prev => ({ ...prev, notifications: val }));
    };

    const selectLanguage = (langId) => {
        setSettings(prev => ({ ...prev, translation: langId }));
        setModalVisible(false);
    };

    const selectReciter = (reciterId) => {
        setSettings(prev => ({ ...prev, reciter: reciterId }));
        setReciterModalVisible(false);
    };

    const selectTafsir = (tafsirId) => {
        setSettings(prev => ({ ...prev, tafsir: tafsirId }));
        setTafsirModalVisible(false);
    };

    const handleFeedback = () => {
        Linking.openURL('https://www.facebook.com/profile.php?id=61584998726486');
    };

    const currentLabels = LANGUAGES.find(l => l.id === settings.translation) || LANGUAGES[0];
    const currentReciter = RECITERS.find(r => r.id === settings.reciter) || RECITERS[0];
    const currentTafsir = TAFSIR_EDITIONS.find(t => t.id === settings.tafsir) || TAFSIR_EDITIONS[0];

    return (
        <View style={styles.container}>
            {/* ... TopBar ... */}

            <ScrollView contentContainerStyle={styles.content}>
                {/* ... existing sections ... */}
                <Text style={styles.header}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <SettingItem
                        label="Daily Notifications"
                        value={settings.notifications}
                        onValueChange={toggleNotification}
                    />

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.dropdownRow}
                        onPress={() => navigation.navigate('Schedule')}
                    >
                        <View>
                            <Text style={styles.settingLabel}>Schedule Reminders</Text>
                            <Text style={styles.subLabel}>Set daily Focus Mode times</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textDim} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Content</Text>
                    <TouchableOpacity style={styles.dropdownRow} onPress={() => setModalVisible(true)}>
                        <View>
                            <Text style={styles.settingLabel}>Translation Language</Text>
                            <Text style={styles.subLabel}>Tap to change</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.valueText}>
                                {currentLabels.label}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textDim} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.dropdownRow} onPress={() => setReciterModalVisible(true)}>
                        <View>
                            <Text style={styles.settingLabel}>Quran Reciter</Text>
                            <Text style={styles.subLabel}>Select Tilawat voice</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.valueText}>
                                {currentReciter.name}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textDim} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.dropdownRow} onPress={() => setTafsirModalVisible(true)}>
                        <View>
                            <Text style={styles.settingLabel}>Tafsir Edition</Text>
                            <Text style={styles.subLabel}>Select commentary language</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.valueText}>
                                {currentTafsir.name}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textDim} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.dropdownRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.settingLabel}>Auto-Rotate Timer</Text>
                            <Text style={styles.subLabel}>How fast ayats change</Text>
                        </View>
                        <View style={styles.timerOptions}>
                            {[30, 60, 90, 120].map(seconds => (
                                <TouchableOpacity
                                    key={seconds}
                                    style={[
                                        styles.timerOption,
                                        settings.rotationInterval === seconds && styles.timerOptionActive
                                    ]}
                                    onPress={() => setSettings(prev => ({ ...prev, rotationInterval: seconds }))}
                                >
                                    <Text style={[
                                        styles.timerOptionText,
                                        settings.rotationInterval === seconds && styles.timerOptionTextActive
                                    ]}>
                                        {seconds}s
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.dropdownRow} onPress={handleFeedback}>
                        <View>
                            <Text style={styles.settingLabel}>Visit Facebook Page</Text>
                            <Text style={styles.subLabel}>Comments, Reviews & Complaints</Text>
                        </View>
                        <Ionicons name="logo-facebook" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.aboutBox}>
                    <Text style={styles.aboutText}>Quran Focus App v1.1</Text>
                    <Text style={styles.aboutSub}>Designed for Peace & Reflection</Text>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Language</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.langOption,
                                        settings.translation === item.id && styles.selectedOption
                                    ]}
                                    onPress={() => selectLanguage(item.id)}
                                >
                                    <Text style={styles.langName}>{item.label}</Text>
                                    <Text style={styles.langNative}>{item.native}</Text>
                                    {settings.translation === item.id &&
                                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                                    }
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={reciterModalVisible}
                onRequestClose={() => setReciterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Reciter</Text>
                            <TouchableOpacity onPress={() => setReciterModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={RECITERS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.langOption,
                                        settings.reciter === item.id && styles.selectedOption
                                    ]}
                                    onPress={() => selectReciter(item.id)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.langName}>{item.name}</Text>
                                        <Text style={styles.langNative}>{item.nameArabic}</Text>
                                    </View>
                                    {settings.reciter === item.id &&
                                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                                    }
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={tafsirModalVisible}
                onRequestClose={() => setTafsirModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Tafsir</Text>
                            <TouchableOpacity onPress={() => setTafsirModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={TAFSIR_EDITIONS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.langOption,
                                        settings.tafsir === item.id && styles.selectedOption
                                    ]}
                                    onPress={() => selectTafsir(item.id)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.langName}>{item.name}</Text>
                                        <Text style={styles.langNative}>{item.language}</Text>
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
    },
    topBar: {
        paddingTop: 50,
        paddingHorizontal: SPACING.lg,
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
        padding: SPACING.lg,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xl,
        marginTop: SPACING.sm,
    },
    section: {
        marginBottom: SPACING.xl,
        backgroundColor: COLORS.bgLight,
        borderRadius: 16,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionTitle: {
        color: COLORS.secondary,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
        textTransform: 'uppercase',
        fontSize: 12,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    dropdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    settingLabel: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    subLabel: {
        color: COLORS.textDim,
        fontSize: 12,
        marginTop: 2,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    valueText: {
        color: COLORS.accent,
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: SPACING.md,
    },
    timerOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    timerOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.textDim,
        backgroundColor: 'transparent',
    },
    timerOptionActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    timerOptionText: {
        color: COLORS.textDim,
        fontSize: 13,
        fontWeight: '600',
    },
    timerOptionTextActive: {
        color: '#000000',
    },
    aboutBox: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    aboutText: {
        color: COLORS.textDim,
        fontSize: 14,
    },
    aboutSub: {
        color: COLORS.secondary,
        fontSize: 12,
        marginTop: 4,
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
    langOption: {
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
    langName: {
        color: COLORS.text,
        fontSize: 16,
        flex: 1,
    },
    langNative: {
        color: COLORS.textDim,
        fontSize: 14,
        marginRight: SPACING.md,
    },
});

export default SettingsScreen;

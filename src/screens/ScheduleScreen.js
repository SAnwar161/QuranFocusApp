import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Switch,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';
import {
    getScheduledReminders,
    addReminder,
    removeReminder,
    toggleReminder,
    formatTime,
    requestNotificationPermissions,
} from '../services/notificationService';

const MAX_REMINDERS = 10;

const ScheduleScreen = () => {
    const navigation = useNavigation();
    const [reminders, setReminders] = useState([]);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [hourInput, setHourInput] = useState('8');
    const [minuteInput, setMinuteInput] = useState('00');
    const [isPM, setIsPM] = useState(false);
    const [label, setLabel] = useState('');
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        loadReminders();
        checkPermissions();
    }, []);

    const loadReminders = async () => {
        const data = await getScheduledReminders();
        setReminders(data);
    };

    const checkPermissions = async () => {
        const granted = await requestNotificationPermissions();
        setHasPermission(granted);
    };

    const handleAddReminder = () => {
        if (reminders.length >= MAX_REMINDERS) {
            Alert.alert('Limit Reached', 'Maximum 10 reminders allowed');
            return;
        }
        setHourInput('8');
        setMinuteInput('00');
        setIsPM(false);
        setLabel('');
        setShowTimeModal(true);
    };

    const validateAndSave = async () => {
        // Validate hour
        let hour = parseInt(hourInput) || 0;
        if (hour < 1 || hour > 12) {
            Alert.alert('Invalid Hour', 'Please enter hour between 1 and 12');
            return;
        }

        // Validate minute
        let minute = parseInt(minuteInput) || 0;
        if (minute < 0 || minute > 59) {
            Alert.alert('Invalid Minute', 'Please enter minute between 0 and 59');
            return;
        }

        // Convert to 24-hour format
        let hour24 = hour;
        if (isPM && hour !== 12) hour24 = hour + 12;
        if (!isPM && hour === 12) hour24 = 0;

        const result = await addReminder(hour24, minute, label);

        if (result.success) {
            setReminders([...reminders, result.reminder]);
            setShowTimeModal(false);
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const handleToggle = async (id) => {
        const updated = await toggleReminder(id);
        setReminders(updated);
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Reminder',
            'Are you sure you want to delete this reminder?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const updated = await removeReminder(id);
                        setReminders(updated);
                    },
                },
            ]
        );
    };

    const renderReminder = ({ item }) => (
        <View style={styles.reminderItem}>
            <View style={styles.reminderInfo}>
                <Text style={styles.reminderTime}>
                    {formatTime(item.hour, item.minute)}
                </Text>
                <Text style={styles.reminderLabel}>{item.label}</Text>
            </View>
            <View style={styles.reminderActions}>
                <Switch
                    value={item.enabled}
                    onValueChange={() => handleToggle(item.id)}
                    trackColor={{ false: COLORS.bgLight, true: COLORS.primary }}
                    thumbColor={item.enabled ? COLORS.accent : COLORS.textDim}
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color={COLORS.textDim} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Schedule Reminders</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Permission Warning */}
            {!hasPermission && (
                <View style={styles.warningBox}>
                    <Ionicons name="warning" size={20} color="#FF6B6B" />
                    <Text style={styles.warningText}>
                        Notifications not enabled. Please enable in settings.
                    </Text>
                </View>
            )}

            {/* Info Text */}
            <Text style={styles.infoText}>
                Set daily reminders to practice Quran reflection. You can add up to 10 reminders.
            </Text>

            {/* Reminders List */}
            {reminders.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="alarm-outline" size={64} color={COLORS.textDim} />
                    <Text style={styles.emptyText}>No reminders set</Text>
                    <Text style={styles.emptySubtext}>
                        Tap the button below to add your first reminder
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={reminders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderReminder}
                    style={styles.list}
                />
            )}

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
                <Ionicons name="add" size={24} color="#000" />
                <Text style={styles.addButtonText}>Add Reminder</Text>
            </TouchableOpacity>

            {/* Time Input Modal */}
            <Modal
                visible={showTimeModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowTimeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set Reminder Time</Text>

                        {/* Time Input Row */}
                        <View style={styles.timeInputRow}>
                            <View style={styles.timeInputContainer}>
                                <Text style={styles.inputLabel}>Hour</Text>
                                <TextInput
                                    style={styles.timeInput}
                                    value={hourInput}
                                    onChangeText={(t) => setHourInput(t.replace(/[^0-9]/g, '').slice(0, 2))}
                                    keyboardType="number-pad"
                                    maxLength={2}
                                    placeholder="8"
                                    placeholderTextColor={COLORS.textDim}
                                />
                            </View>

                            <Text style={styles.timeSeparator}>:</Text>

                            <View style={styles.timeInputContainer}>
                                <Text style={styles.inputLabel}>Minute</Text>
                                <TextInput
                                    style={styles.timeInput}
                                    value={minuteInput}
                                    onChangeText={(t) => setMinuteInput(t.replace(/[^0-9]/g, '').slice(0, 2))}
                                    keyboardType="number-pad"
                                    maxLength={2}
                                    placeholder="00"
                                    placeholderTextColor={COLORS.textDim}
                                />
                            </View>

                            {/* AM/PM Toggle */}
                            <View style={styles.ampmContainer}>
                                <TouchableOpacity
                                    style={[styles.ampmButton, !isPM && styles.ampmButtonSelected]}
                                    onPress={() => setIsPM(false)}
                                >
                                    <Text style={[styles.ampmText, !isPM && styles.ampmTextSelected]}>AM</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ampmButton, isPM && styles.ampmButtonSelected]}
                                    onPress={() => setIsPM(true)}
                                >
                                    <Text style={[styles.ampmText, isPM && styles.ampmTextSelected]}>PM</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Label Input */}
                        <Text style={styles.inputLabel}>Label (Optional)</Text>
                        <TextInput
                            style={styles.labelInput}
                            placeholder="e.g., Fajr, After Work"
                            placeholderTextColor={COLORS.textDim}
                            value={label}
                            onChangeText={setLabel}
                            maxLength={20}
                        />

                        {/* Buttons */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowTimeModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={validateAndSave}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    title: {
        color: COLORS.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        padding: SPACING.md,
        marginHorizontal: SPACING.lg,
        borderRadius: 10,
        gap: 10,
        marginBottom: SPACING.md,
    },
    warningText: {
        color: '#FF6B6B',
        fontSize: 13,
        flex: 1,
    },
    infoText: {
        color: COLORS.textDim,
        fontSize: 14,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    list: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    reminderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.bgLight,
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    reminderInfo: {
        flex: 1,
    },
    reminderTime: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    reminderLabel: {
        color: COLORS.textDim,
        fontSize: 14,
        marginTop: 2,
    },
    reminderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    deleteButton: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '600',
        marginTop: SPACING.md,
    },
    emptySubtext: {
        color: COLORS.textDim,
        fontSize: 14,
        textAlign: 'center',
        marginTop: SPACING.sm,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
        borderRadius: 12,
        gap: 8,
    },
    addButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    timeInputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
        gap: 8,
    },
    timeInputContainer: {
        alignItems: 'center',
    },
    inputLabel: {
        color: COLORS.textDim,
        fontSize: 12,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    timeInput: {
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 12,
        padding: SPACING.md,
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        width: 70,
    },
    timeSeparator: {
        color: COLORS.primary,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ampmContainer: {
        marginLeft: 8,
    },
    ampmButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.textDim,
        marginBottom: 4,
    },
    ampmButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    ampmText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    ampmTextSelected: {
        color: '#000',
    },
    labelInput: {
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: COLORS.textDim,
        borderRadius: 12,
        padding: SPACING.md,
        color: COLORS.text,
        fontSize: 16,
        marginBottom: SPACING.lg,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    cancelButton: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.textDim,
    },
    cancelButtonText: {
        color: COLORS.textDim,
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ScheduleScreen;

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

const REMINDERS_KEY = 'scheduled_reminders';
const MAX_REMINDERS = 10;
const CHANNEL_ID = 'focus-reminders-v2'; // New channel to ensure fresh settings

// Configure notification behavior with vibration
Notifications.setNotificationHandler({
    handleNotification: async () => {
        // Trigger vibration when notification is received
        Vibration.vibrate([0, 500, 200, 500, 200, 500]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        return {
            shouldShowAlert: true,
            shouldPlaySound: false, // No sound
            shouldSetBadge: false,
        };
    },
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
    }

    // Android needs notification channel - new channel ID to reset settings
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: 'Focus Mode Reminders',
            description: 'Daily reminders for Quran Focus Mode',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 500, 200, 500, 200, 500],
            lightColor: '#D4AF37',
            sound: null,
            enableVibrate: true,
            enableLights: true,
        });
    }

    return true;
};

// Schedule a daily reminder
export const scheduleReminder = async (reminder) => {
    const { id, hour, minute, label, enabled } = reminder;

    if (!enabled) {
        await cancelReminder(id);
        return;
    }

    // Cancel existing notification for this ID first
    await cancelReminder(id);

    // Calculate next trigger time
    const now = new Date();
    let triggerDate = new Date();
    triggerDate.setHours(hour, minute, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
    }

    // Schedule new daily notification
    await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: {
            title: label || 'Quran Focus Time 📖',
            body: 'Time for your daily Quran reflection!',
            data: { screen: 'Focus' },
            sound: false, // Vibration only, no sound
        },
        trigger: {
            type: 'daily',
            hour: hour,
            minute: minute,
            channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
        },
    });

    console.log(`Scheduled reminder: ${id} at ${hour}:${minute}`);
};

// Cancel a specific reminder
export const cancelReminder = async (id) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(id);
        console.log(`Cancelled reminder: ${id}`);
    } catch (error) {
        console.log('Error cancelling notification:', error);
    }
};

// Cancel all reminders
export const cancelAllReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminders cancelled');
};

// Save reminders to storage
export const saveScheduledReminders = async (reminders) => {
    try {
        await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
        return true;
    } catch (error) {
        console.error('Failed to save reminders:', error);
        return false;
    }
};

// Get reminders from storage
export const getScheduledReminders = async () => {
    try {
        const data = await AsyncStorage.getItem(REMINDERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get reminders:', error);
        return [];
    }
};

// Add a new reminder
export const addReminder = async (hour, minute, label = '') => {
    const reminders = await getScheduledReminders();

    if (reminders.length >= MAX_REMINDERS) {
        return { success: false, error: 'Maximum 10 reminders allowed' };
    }

    const id = `reminder_${Date.now()}`;
    const newReminder = {
        id,
        hour,
        minute,
        label: label || `Reminder ${reminders.length + 1}`,
        enabled: true,
    };

    reminders.push(newReminder);
    await saveScheduledReminders(reminders);
    await scheduleReminder(newReminder);

    return { success: true, reminder: newReminder };
};

// Remove a reminder
export const removeReminder = async (id) => {
    await cancelReminder(id);
    const reminders = await getScheduledReminders();
    const filtered = reminders.filter(r => r.id !== id);
    await saveScheduledReminders(filtered);
    return filtered;
};

// Toggle a reminder on/off
export const toggleReminder = async (id) => {
    const reminders = await getScheduledReminders();
    const updated = reminders.map(r => {
        if (r.id === id) {
            return { ...r, enabled: !r.enabled };
        }
        return r;
    });

    await saveScheduledReminders(updated);

    // Reschedule the toggled reminder
    const reminder = updated.find(r => r.id === id);
    if (reminder) {
        await scheduleReminder(reminder);
    }

    return updated;
};

// Restore all saved reminders (call on app start)
export const restoreReminders = async () => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const reminders = await getScheduledReminders();
    for (const reminder of reminders) {
        if (reminder.enabled) {
            await scheduleReminder(reminder);
        }
    }
    console.log(`Restored ${reminders.length} reminders`);
};

// Format time for display
export const formatTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
};

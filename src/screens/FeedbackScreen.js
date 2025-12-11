
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Linking, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

const FeedbackScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('General');

    const handleSubmit = () => {
        if (!message.trim()) {
            Alert.alert("Please enter a message");
            return;
        }

        const subject = `Feedback: ${category} - ${name || 'User'}`;
        const body = `Name: ${name || 'Anonymous'}\nCategory: ${category}\n\nMessage:\n${message}\n\n(Sent from Quran Focus App)`;
        const email = "support@quranfocus.app"; // Developer's backend email

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(url).catch(() =>
            Alert.alert("Error", "Could not open email client. Please email us at support@quranfocus.app")
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Feedback</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.heading}>We value your input</Text>
                    <Text style={styles.subHeading}>Share your thoughts, report bugs, or suggest features.</Text>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your Name"
                                placeholderTextColor={COLORS.textDim}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.categoryRow}>
                                {['General', 'Bug', 'Feature', 'Other'].map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[styles.catChip, category === cat && styles.catChipSelected]}
                                        onPress={() => setCategory(cat)}
                                    >
                                        <Text style={[styles.catText, category === cat && styles.catTextSelected]}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Message</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Type your feedback here..."
                                placeholderTextColor={COLORS.textDim}
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                            <Text style={styles.submitText}>Send Feedback</Text>
                            <Ionicons name="send" size={20} color={COLORS.bgLight} />
                        </TouchableOpacity>

                        <Text style={styles.privacyNote}>
                            Clicking send will open your email app. No data is collected silently.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingBottom: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        padding: SPACING.sm,
    },
    screenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.lg,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subHeading: {
        fontSize: 14,
        color: COLORS.textDim,
        marginBottom: SPACING.xl,
    },
    formContainer: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 20,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        color: COLORS.secondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: SPACING.sm,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        padding: SPACING.md,
        color: COLORS.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    textArea: {
        height: 120,
    },
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    catChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.textDim,
    },
    catChipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    catText: {
        color: COLORS.textDim,
        fontSize: 12,
    },
    catTextSelected: {
        color: COLORS.bgLight,
        fontWeight: 'bold',
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    submitText: {
        color: COLORS.bgLight,
        fontWeight: 'bold',
        fontSize: 16,
    },
    privacyNote: {
        marginTop: SPACING.md,
        color: COLORS.textDim,
        fontSize: 10,
        textAlign: 'center',
        opacity: 0.6,
    },
});

export default FeedbackScreen;

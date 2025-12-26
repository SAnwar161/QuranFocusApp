
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Modal, Linking, Platform, ScrollView } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import { getRandomAyah, getAyah, getTafsir } from '../api/alquran';
import { generateReflectionQuestion } from '../services/geminiService';
import { getReflection, saveReflection, saveBookmark, removeBookmark, isBookmarked } from '../services/storage';
import AyatCard from '../components/AyatCard';
import AudioControls from '../components/AudioControls';
import { COLORS, SPACING } from '../constants/theme';
import { useApp } from '../context/Store';
import { Ionicons } from '@expo/vector-icons';

const FocusScreen = () => {
    useKeepAwake(); // Prevents screen from sleeping
    const route = useRoute();
    const navigation = useNavigation();
    const { updateStats, settings } = useApp();
    const viewShotRef = useRef();

    const [currentAyah, setCurrentAyah] = useState(null);
    const [shareVisible, setShareVisible] = useState(false);
    const [countdown, setCountdown] = useState(settings.rotationInterval || 30);
    const [reflection, setReflection] = useState('');
    const [bookmarked, setBookmarked] = useState(false);
    const rotationTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    const fetchAyah = async (reference = null) => {
        const lang = settings.translation || 'en.sahih';
        // If reference is provided (e.g. "2:255"), use getAyah, otherwise getRandomAyah
        const ayah = reference
            ? await getAyah(reference, ['quran-simple', lang, 'ar.alafasy'])
            : await getRandomAyah(lang);

        if (ayah) {
            setCurrentAyah(ayah);
            updateStats('seen');

            // Check if bookmarked
            checkBookmarkStatus(ayah);

            // Fetch reflection question
            fetchReflectionQuestion(ayah);
        } else {
            // Error handling or fallback if search fails
            if (reference) alert("Ayah not found. Please try 'Surah:Ayah' (e.g. 2:255)");
        }
    };

    const checkBookmarkStatus = async (ayah) => {
        const surahNumber = ayah.surah.number;
        const ayatNumber = ayah.numberInSurah;
        const isMarked = await isBookmarked(surahNumber, ayatNumber);
        setBookmarked(isMarked);
    };

    const handleBookmarkToggle = async () => {
        if (!currentAyah) return;

        const surahNumber = currentAyah.surah.number;
        const ayatNumber = currentAyah.numberInSurah;

        if (bookmarked) {
            await removeBookmark(surahNumber, ayatNumber);
            setBookmarked(false);
        } else {
            await saveBookmark(surahNumber, ayatNumber);
            setBookmarked(true);
        }
    };

    const fetchReflectionQuestion = async (ayah) => {
        // Check cache first
        const cached = await getReflection(ayah.number);
        if (cached) {
            setReflection(cached);
            return;
        }

        // Generate new question
        const translation = ayah.translation ? ayah.translation.text : ayah.text;
        const question = await generateReflectionQuestion(ayah.text, translation);
        setReflection(question);

        // Cache it
        await saveReflection(ayah.number, question);
    };

    useEffect(() => {
        // If passed via navigation (Search)
        if (route.params?.initialReference) {
            fetchAyah(route.params.initialReference);
            // Don't auto-rotate if user specifically searched for one
            return;
        }

        fetchAyah();

        const intervalMs = (settings.rotationInterval || 60) * 1000;
        setCountdown(settings.rotationInterval || 60);

        // Auto-rotate based on user setting
        rotationTimerRef.current = setInterval(() => {
            fetchAyah();
            setCountdown(settings.rotationInterval || 60);
        }, intervalMs);

        // Countdown ticker (updates every second)
        countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : settings.rotationInterval || 60);
        }, 1000);

        return () => {
            if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        };
    }, [settings.translation, settings.rotationInterval, route.params]);

    // Track time spent in focus mode
    useEffect(() => {
        const interval = setInterval(() => {
            updateStats('focus', 1);
        }, 60000); // Every minute
        return () => clearInterval(interval);
    }, []);

    const getShareMessage = () => {
        if (!currentAyah) return '';
        const trans = currentAyah.translation ? currentAyah.translation.text : '';
        return `"${currentAyah.text}"\n\n${trans}\n\nShared via QuranFocus App`;
    };

    const captureAndShare = async () => {
        if (!viewShotRef.current) return null;
        try {
            const uri = await viewShotRef.current.capture();
            return uri;
        } catch (error) {
            console.error("Capture failed", error);
            return null;
        }
    };

    const handleShareWithImage = async () => {
        setShareVisible(false);
        const imageUri = await captureAndShare();
        if (imageUri) {
            await Sharing.shareAsync(imageUri, {
                mimeType: 'image/jpeg',
                dialogTitle: 'Share Ayat Card',
            });
            updateStats('shared');
        }
    };

    // Note: Direct deep linking with images (e.g. whatsapp://) isn't reliably supported 
    // without native modules or passing file:// URIs which often require the system share sheet anyway.
    // So for "Image Sharing", we route through the system share sheet which allows selecting the app.

    const handleWhatsAppShare = () => handleShareWithImage();
    const handleFacebookShare = () => handleShareWithImage();
    const handleInstagramShare = () => handleShareWithImage();
    const handleTwitterShare = () => handleShareWithImage();
    // System share also defaults to image now
    const handleSystemShare = () => handleShareWithImage();

    const handleHome = () => {
        navigation.navigate('Home');
    };

    const handleTafsir = () => {
        if (!currentAyah) return;
        // Open Quran.com Tafsirs for the specific Ayah
        const url = `https://quran.com/${currentAyah.surah.number}/${currentAyah.numberInSurah}/tafsirs`;
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleHome} style={styles.iconBtn}>
                    <Ionicons name="home-outline" size={28} color={COLORS.textDim} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShareVisible(true)} style={styles.iconBtn}>
                    <Ionicons name="share-social-outline" size={28} color={COLORS.textDim} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {currentAyah ? (
                    <>
                        {/* Hidden view for full content capture */}
                        <View style={styles.hiddenCaptureView}>
                            <ViewShot
                                ref={viewShotRef}
                                options={{ format: "jpg", quality: 0.9 }}
                            >
                                <AyatCard
                                    ayat={currentAyah}
                                    translation={currentAyah.translation}
                                    reflection={reflection}
                                    forCapture={true}
                                />
                            </ViewShot>
                        </View>

                        {/* Main display view */}
                        <View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                            <AyatCard
                                ayat={currentAyah}
                                translation={currentAyah.translation}
                                reflection={reflection}
                            />
                        </View>

                        {/* Compact Controls Row */}
                        <View style={styles.controlsRow}>
                            {/* Audio Controls */}
                            <AudioControls
                                key={currentAyah.number}
                                audioUrl={currentAyah.audio}
                                onTafsirPress={handleTafsir}
                            />

                            {/* Bookmark Button */}
                            <TouchableOpacity
                                style={styles.bookmarkButtonCompact}
                                onPress={handleBookmarkToggle}
                            >
                                <Ionicons
                                    name={bookmarked ? "star" : "star-outline"}
                                    size={24}
                                    color={COLORS.accent}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Countdown Timer Display */}
                        {!route.params?.initialReference && (
                            <View style={styles.countdownContainer}>
                                <Ionicons name="time-outline" size={16} color={COLORS.accent} />
                                <Text style={styles.countdownText}>
                                    Next in {countdown}s
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <Text style={styles.loadingText}>Reflecting...</Text>
                )}
            </View>


            <TouchableOpacity style={styles.nextBtn} onPress={() => {
                fetchAyah();
                setCountdown(settings.rotationInterval || 60);
            }}>
                <Text style={styles.nextText}>Next Ayat</Text>
            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={shareVisible}
                onRequestClose={() => setShareVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShareVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Share Ayat Card</Text>

                        <View style={styles.shareRow}>
                            <TouchableOpacity style={styles.shareOption} onPress={handleWhatsAppShare}>
                                <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                                    <Ionicons name="logo-whatsapp" size={24} color="white" />
                                </View>
                                <Text style={styles.shareText}>WhatsApp</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.shareOption} onPress={handleFacebookShare}>
                                <View style={[styles.shareIcon, { backgroundColor: '#1877F2' }]}>
                                    <Ionicons name="logo-facebook" size={24} color="white" />
                                </View>
                                <Text style={styles.shareText}>Facebook</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.shareOption} onPress={handleInstagramShare}>
                                <View style={[styles.shareIcon, { backgroundColor: '#E1306C' }]}>
                                    <Ionicons name="logo-instagram" size={24} color="white" />
                                </View>
                                <Text style={styles.shareText}>Instagram</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.shareOption} onPress={handleTwitterShare}>
                                <View style={[styles.shareIcon, { backgroundColor: '#1DA1F2' }]}>
                                    <Ionicons name="logo-twitter" size={24} color="white" />
                                </View>
                                <Text style={styles.shareText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.systemShareBtn} onPress={handleSystemShare}>
                            <Text style={styles.systemShareText}>More Options / Save Image</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShareVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
    },
    topBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        zIndex: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        // marginBottom: 50, 
        // paddingBottom: 20, // Removed to allow full stretch
    },
    hiddenCaptureView: {
        position: 'absolute',
        left: -9999, // Position offscreen
        width: 400, // Fixed width for capture
    },
    loadingText: {
        color: COLORS.accent,
        textAlign: 'center',
        fontSize: 18,
    },
    countdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    countdownText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    nextBtn: {
        marginBottom: 50,
        marginTop: 30, // Added space to separate from audio controls
        alignSelf: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.textDim,
    },
    nextText: {
        color: COLORS.textDim,
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.bgLight,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
    },
    modalTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    shareRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.xl,
        flexWrap: 'wrap',
    },
    shareOption: {
        alignItems: 'center',
        gap: SPACING.sm,
        width: '20%',
    },
    shareIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareText: {
        color: COLORS.textDim,
        fontSize: 11,
        marginTop: 4,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 4, // Minimal spacing for maximum card size
    },
    bookmarkButtonCompact: {
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 4,
    },
    bookmarkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 20,
        marginTop: SPACING.md, // Reduced to md for compact layout
        gap: 8,
    },
    bookmarkText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: SPACING.md,
    },
    systemShareBtn: {
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    systemShareText: {
        color: COLORS.accent,
        fontSize: 14,
    },
    cancelBtn: {
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    cancelText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    tafsirText: {
        color: COLORS.text,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
});

export default FocusScreen;

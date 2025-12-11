
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Modal, Linking, Platform, ScrollView } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import { getRandomAyah, getAyah, getTafsir } from '../api/alquran';
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
    const rotationTimerRef = useRef(null);

    const fetchAyah = async (reference = null) => {
        const lang = settings.translation || 'en.asad';
        // If reference is provided (e.g. "2:255"), use getAyah, otherwise getRandomAyah
        const ayah = reference
            ? await getAyah(reference, ['quran-uthmani', lang, 'ar.alafasy'])
            : await getRandomAyah(lang);

        if (ayah) {
            setCurrentAyah(ayah);
            updateStats('seen');
        } else {
            // Error handling or fallback if search fails
            if (reference) alert("Ayah not found. Please try 'Surah:Ayah' (e.g. 2:255)");
        }
    };

    useEffect(() => {
        // If passed via navigation (Search)
        if (route.params?.initialReference) {
            fetchAyah(route.params.initialReference);
            // Don't auto-rotate if user specifically searched for one? 
            // Or maybe delay rotation. let's pause rotation for searched items for now to let them focus.
            return;
        }

        fetchAyah();

        // Auto-rotate every 2 minutes (120000 ms) only for random mode
        rotationTimerRef.current = setInterval(() => {
            fetchAyah();
        }, 120000);

        return () => {
            if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
        };
    }, [settings.translation, route.params]); // Depend on route.params to refetch if params change

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
                        {/* Wrap AyatCard in ViewShot for capture */}
                        <ViewShot
                            ref={viewShotRef}
                            options={{ format: "jpg", quality: 0.9 }}
                            style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}
                        >
                            <AyatCard
                                ayat={currentAyah}
                                translation={currentAyah.translation}
                            />
                        </ViewShot>
                        {/* Key forces remount on ayah change, stopping previous audio */}
                        <AudioControls
                            key={currentAyah.number}
                            audioUrl={currentAyah.audio}
                            onTafsirPress={handleTafsir}
                        />
                    </>
                ) : (
                    <Text style={styles.loadingText}>Reflecting...</Text>
                )}
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={() => fetchAyah()}>
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
    loadingText: {
        color: COLORS.accent,
        textAlign: 'center',
        fontSize: 18,
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

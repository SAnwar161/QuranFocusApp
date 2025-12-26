import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ScrollView, ActivityIndicator, TextInput
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/Store';
import { getSurah } from '../api/alquran';
import {
    saveLastRead, getLastRead,
    saveBookmark, getBookmarks, removeBookmark, isBookmarked
} from '../services/storage';
import { COLORS, SPACING, FONTS } from '../constants/theme';

const SURAHS = require('../data/surahs.json');

const ReadScreen = () => {
    const { settings, updateStats } = useApp();
    const [view, setView] = useState('list'); // 'list' or 'reading'
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [ayats, setAyats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRead, setLastRead] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const scrollRef = useRef(null);

    // Audio state - managed at parent level for continuous playback
    const [currentSound, setCurrentSound] = useState(null);
    const [playingAyatIndex, setPlayingAyatIndex] = useState(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [continuousPlay, setContinuousPlay] = useState(true); // Auto-play next ayat

    useEffect(() => {
        // loadLastRead(); // Disabled - resume reading removed
        loadBookmarks();
    }, []);

    // Cleanup audio when leaving reading view
    useEffect(() => {
        return () => {
            if (currentSound) {
                currentSound.unloadAsync();
            }
        };
    }, [currentSound]);

    // Cleanup when going back to list
    const handleBackToList = async () => {
        if (currentSound) {
            await currentSound.unloadAsync();
            setCurrentSound(null);
        }
        setPlayingAyatIndex(null);
        setView('list');
    };

    const loadLastRead = async () => {
        const last = await getLastRead();
        setLastRead(last);
    };

    const loadBookmarks = async () => {
        const marks = await getBookmarks();
        setBookmarks(marks);
    };

    const handleSurahSelect = async (surahNumber) => {
        setLoading(true);
        console.log('Loading Surah:', surahNumber);
        try {
            const data = await getSurah(surahNumber, settings.translation);
            setAyats(data.ayahs);
            setSelectedSurah(SURAHS[surahNumber - 1]);
            setView('reading');
        } catch (error) {
            console.error('Failed to load surah:', error);
        } finally {
            setLoading(false);
        }
    };

    // Play ayat audio with continuous playback support
    const playAyat = async (ayatIndex) => {
        const ayat = ayats[ayatIndex];
        if (!ayat || !ayat.audio) return;

        try {
            // Stop current sound if any
            if (currentSound) {
                await currentSound.unloadAsync();
                setCurrentSound(null);
            }

            // If tapping same ayat that was playing, just stop
            if (playingAyatIndex === ayatIndex) {
                setPlayingAyatIndex(null);
                return;
            }

            setIsAudioLoading(true);
            setPlayingAyatIndex(ayatIndex);

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: ayat.audio });
            setCurrentSound(newSound);
            setIsAudioLoading(false);

            await newSound.playAsync();

            // Track listened stat
            updateStats('listened');

            // Listen for playback finish
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    // Check if there's a next ayat and continuous play is enabled
                    const nextIndex = ayatIndex + 1;
                    if (continuousPlay && nextIndex < ayats.length && ayats[nextIndex].audio) {
                        // Wait 2 seconds then play next ayat
                        setTimeout(() => {
                            playAyat(nextIndex);
                            // Scroll to next ayat
                            scrollRef.current?.scrollToIndex({
                                index: nextIndex,
                                animated: true,
                                viewPosition: 0.3,
                            });
                        }, 2000);
                    } else {
                        setPlayingAyatIndex(null);
                    }
                }
            });
        } catch (error) {
            console.log('Error playing audio:', error);
            setIsAudioLoading(false);
            setPlayingAyatIndex(null);
        }
    };

    // Stop all audio
    const stopAudio = async () => {
        if (currentSound) {
            await currentSound.unloadAsync();
            setCurrentSound(null);
        }
        setPlayingAyatIndex(null);
    };

    const handleResumeReading = () => {
        if (lastRead) {
            handleSurahSelect(lastRead.surah, lastRead.ayat);
        }
    };

    const handleBookmarkToggle = async (surahNumber, ayatNumber) => {
        const bookmarked = await isBookmarked(surahNumber, ayatNumber);

        if (bookmarked) {
            const updated = await removeBookmark(surahNumber, ayatNumber);
            setBookmarks(updated); // Immediately update UI
            console.log('Removed bookmark:', surahNumber, ayatNumber);
        } else {
            const updated = await saveBookmark(surahNumber, ayatNumber);
            setBookmarks(updated); // Immediately update UI
            console.log('Added bookmark:', surahNumber, ayatNumber);
        }
    };

    const handleScroll = (event) => {
        // Scroll tracking disabled - resume reading feature removed
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.loaderText}>Loading...</Text>
            </View>
        );
    }

    if (view === 'reading') {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackToList}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.surahInfo}>
                        <Text style={styles.surahName}>{selectedSurah?.transliteration}</Text>
                        <Text style={styles.surahMeta}>
                            {selectedSurah?.translation} • {selectedSurah?.totalVerses} Ayats
                        </Text>
                    </View>
                    {/* Stop button when playing */}
                    {playingAyatIndex !== null && (
                        <TouchableOpacity onPress={stopAudio} style={styles.stopButton}>
                            <Ionicons name="stop" size={20} color={COLORS.background} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Ayats */}
                <FlatList
                    ref={scrollRef}
                    data={ayats}
                    keyExtractor={(item) => item.number.toString()}
                    renderItem={({ item, index }) => (
                        <AyatCard
                            ayat={item}
                            ayatIndex={index}
                            surahNumber={selectedSurah.number}
                            bookmarks={bookmarks}
                            onBookmarkToggle={handleBookmarkToggle}
                            isPlaying={playingAyatIndex === index}
                            isLoading={isAudioLoading && playingAyatIndex === index}
                            onPlayPress={() => playAyat(index)}
                        />
                    )}
                    style={styles.ayatsList}
                    onScroll={handleScroll}
                    scrollEventThrottle={1000}
                    onScrollToIndexFailed={(info) => {
                        console.log('Scroll to index failed, using offset fallback');
                        setTimeout(() => {
                            scrollRef.current?.scrollToOffset({
                                offset: info.index * 400,
                                animated: false
                            });
                        }, 100);
                    }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Resume Button - Disabled */}
            {/* {lastRead && (
                <TouchableOpacity
                    style={styles.resumeButton}
                    onPress={handleResumeReading}
                >
                    <Text style={styles.resumeText}>
                        📖 Continue Reading: Surah {lastRead.surah}, Ayat {lastRead.ayat}
                    </Text>
                </TouchableOpacity>
            )} */}

            {/* Surah List */}
            <FlatList
                data={SURAHS}
                keyExtractor={(item) => item.number.toString()}
                renderItem={({ item }) => (
                    <SurahItem
                        surah={item}
                        bookmarks={bookmarks}
                        onPress={() => handleSurahSelect(item.number)}
                    />
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const SurahItem = ({ surah, bookmarks, onPress }) => {
    const surahBookmarks = bookmarks.filter(b => b.surah === surah.number);
    const bookmarkCount = surahBookmarks.length;

    return (
        <TouchableOpacity style={styles.surahItem} onPress={onPress}>
            <View style={styles.surahNumber}>
                <Text style={styles.numberText}>{surah.number}</Text>
            </View>
            <View style={styles.surahDetails}>
                <Text style={styles.surahArabic}>{surah.name}</Text>
                <Text style={styles.surahTransliteration}>{surah.transliteration}</Text>
                <Text style={styles.surahTranslation}>{surah.translation}</Text>
                {bookmarkCount > 0 && (
                    <Text style={styles.bookmarkBadge}>
                        ⭐ {bookmarkCount} bookmarks: {surahBookmarks.map(b => b.ayat).sort((a, b) => a - b).join(', ')}
                    </Text>
                )}
            </View>
            <View style={styles.surahMeta}>
                <Text style={styles.metaText}>{surah.totalVerses} Ayats</Text>
            </View>
        </TouchableOpacity>
    );
};

const AyatCard = ({ ayat, ayatIndex, surahNumber, bookmarks, onBookmarkToggle, isPlaying, isLoading, onPlayPress }) => {
    const bookmarked = bookmarks.some(b => b.surah === surahNumber && b.ayat === ayat.numberInSurah);

    return (
        <View style={[styles.ayatCard, isPlaying && styles.ayatCardPlaying]}>
            <View style={styles.ayatHeader}>
                <View style={styles.ayatNumberBadge}>
                    <Text style={styles.ayatNumberText}>{ayat.numberInSurah}</Text>
                </View>
                <View style={styles.ayatActions}>
                    {/* Audio Play Button */}
                    {ayat.audio && (
                        <TouchableOpacity
                            onPress={onPlayPress}
                            style={[styles.audioButton, isPlaying && styles.audioButtonPlaying]}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color={COLORS.primary} />
                            ) : (
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={24}
                                    color={isPlaying ? COLORS.background : COLORS.primary}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                    {/* Bookmark Button */}
                    <TouchableOpacity
                        onPress={() => onBookmarkToggle(surahNumber, ayat.numberInSurah)}
                        style={styles.bookmarkButton}
                    >
                        <Ionicons
                            name={bookmarked ? "star" : "star-outline"}
                            size={28}
                            color={COLORS.accent}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.arabicText}>{ayat.text}</Text>

            {ayat.translation && (
                <Text style={styles.translationText}>{ayat.translation.text}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loader: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        color: COLORS.text,
        fontSize: 16,
    },
    header: {
        backgroundColor: COLORS.card,
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        color: COLORS.accent,
        fontSize: 16,
        marginBottom: SPACING.sm,
    },
    surahInfo: {
        alignItems: 'center',
    },
    surahName: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    surahMeta: {
        color: COLORS.textDim,
        fontSize: 14,
        marginTop: 4,
    },
    resumeButton: {
        backgroundColor: COLORS.accent,
        padding: SPACING.md,
        margin: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    resumeText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        padding: SPACING.sm,
    },
    surahItem: {
        backgroundColor: COLORS.card,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    surahNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    numberText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    surahDetails: {
        flex: 1,
    },
    surahArabic: {
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONTS.arabic,
        marginBottom: 4,
    },
    surahTransliteration: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    surahTranslation: {
        color: COLORS.textDim,
        fontSize: 14,
        marginTop: 2,
    },
    metaText: {
        color: COLORS.textDim,
        fontSize: 12,
    },
    bookmarkBadge: {
        color: COLORS.accent,
        fontSize: 12,
        marginTop: 4,
    },
    ayatsList: {
        flex: 1,
    },
    ayatCard: {
        backgroundColor: COLORS.card,
        padding: SPACING.lg,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        borderRadius: 12,
    },
    ayatCardPlaying: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    ayatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    ayatNumberBadge: {
        backgroundColor: COLORS.accent,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ayatNumberText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: 'bold',
    },
    ayatActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    audioButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    audioButtonPlaying: {
        backgroundColor: COLORS.primary,
    },
    stopButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookmarkButton: {
        padding: SPACING.sm,
    },
    bookmarkIcon: {
        fontSize: 24,
    },
    arabicText: {
        fontFamily: FONTS.arabic,
        fontSize: 28,
        lineHeight: 50,
        color: COLORS.text,
        textAlign: 'right',
        marginBottom: SPACING.md,
    },
    translationText: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.textDim,
        fontStyle: 'italic',
    },
});

export default ReadScreen;

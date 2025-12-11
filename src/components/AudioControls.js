
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'; // Assumes expo-vector-icons is installed (standard in expo)
import { COLORS } from '../constants/theme';

const AudioControls = ({ audioUrl, onTafsirPress }) => {
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const toggleSound = async () => {
        if (!audioUrl) return;

        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                setIsLoading(true);
                const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
                setSound(newSound);
                setIsLoading(false);
                await newSound.playAsync();
                setIsPlaying(true);

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        // Optionally start next track or reset
                    }
                });
            }
        } catch (error) {
            console.log('Error playing sound', error);
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={toggleSound}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={COLORS.background} />
                ) : (
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={32}
                        color={COLORS.background}
                    />
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.smallButton, { marginLeft: 20, width: 'auto', paddingHorizontal: 15, height: 48, borderRadius: 24 }]}
                onPress={onTafsirPress}
            >
                <Ionicons name="book-outline" size={24} color={COLORS.background} />
                <React.Fragment>
                    {/* Add spacer */}
                    <View style={{ width: 5 }} />
                </React.Fragment>
                <Text style={{ color: COLORS.background, fontWeight: 'bold', fontSize: 13 }}>Tafsir</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    smallButton: {
        backgroundColor: COLORS.primary,
        // width handled inline or via minWidth
        height: 48,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 4,
    },
    button: {
        backgroundColor: COLORS.primary,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#D4AF37",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default AudioControls;

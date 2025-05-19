// 📁 File: app/index.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '../context/user.context';
import { View, Image, StyleSheet } from 'react-native';

export default function Index() {
    const router = useRouter();
    const { token, tokenReady } = useUser();
    const [isSplash, setIsSplash] = useState(true); // ✅ FIXED

    useEffect(() => {
        console.log("🔁 index.jsx mounted");
        console.log("📦 tokenReady:", tokenReady);
        console.log("📦 token:", token);

        if (!tokenReady) {
            console.log("⏳ Waiting for token to be ready...");
            return;
        }

        const timeout = setTimeout(() => {
            if (token) {
                console.log("✅ Authenticated → navigating to dashboard");
                router.replace('/dashboard');
            } else {
                console.log("🔓 Not authenticated → navigating to welcome");
                router.replace('/welcome');
            }
            setIsSplash(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [tokenReady, token]);


    if (isSplash) {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../assets/images/splash-icon.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#090c25',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
    },
});

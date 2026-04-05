import * as ExpoSplash from 'expo-splash-screen'
import { router } from 'expo-router'
import { Animated, Dimensions, Easing, Image, StyleSheet, View, Text } from 'react-native'
import { useEffect, useRef, useState } from 'react'

import { brandSplashBackground } from '../theme/brandAssets'
import { useSession } from '../hooks/useSession'
import { colors, typography } from '../theme'

const splashSource = require('../../assets/splash-icon.png')


const MIN_SPLASH_DURATION = 2000 // 2 segundos mínimo para mostrar el logo
const ANIMATION_DURATION = 600

export function SplashScreen() {
  const { session, loading } = useSession()
  const [isReady, setIsReady] = useState(false)

  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.85)).current
  const taglineOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Precargar assets para evitar parpadeos
    const prepare = async () => {
      try {
        await ExpoSplash.preventAutoHideAsync()
      } catch (e) {
        console.warn('SplashScreen prepare error:', e)
      }
    }
    prepare()
  }, [])

  // Animación de entrada del logo
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true
        })
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start()
  }, [opacity, scale, taglineOpacity])

  // Manejo de navegación después del splash
  useEffect(() => {
    if (loading) return

    const timer = setTimeout(() => {
      setIsReady(true)
      ExpoSplash.hideAsync()
        .then(() => {
          router.replace(session ? '/inicio' : '/onboarding')
        })
        .catch(() => {
          router.replace(session ? '/inicio' : '/onboarding')
        })
    }, MIN_SPLASH_DURATION)

    return () => clearTimeout(timer)
  }, [loading, session])

  const { width, height } = Dimensions.get('window')
  const logoSize = Math.min(width, height) * 0.55

  return (
    <View style={[styles.root, { backgroundColor: brandSplashBackground }]}>
      {/* Logo principal con animación */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity,
            transform: [{ scale }],
            width: logoSize,
            height: logoSize
          }
        ]}
      >
        <Image
          source={splashSource}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}> 
        <Text style={styles.tagline}>Rescata sabor,</Text>
        <Text style={styles.taglineAccent}>protege el planeta</Text>
      </Animated.View>

      {/* Loading indicator sutil */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  logoImage: {
    width: '100%',
    height: '100%'
  },
  taglineContainer: {
    alignItems: 'center',
    gap: 4
  },
  tagline: {
    ...typography.title,
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500'
  },
  taglineAccent: {
    ...typography.title,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '700',
    fontStyle: 'italic'
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center'
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.6
  }
})
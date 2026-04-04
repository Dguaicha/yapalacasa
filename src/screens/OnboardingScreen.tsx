import { router } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LogoSalvar } from '../components/branding/LogoSalvar'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { EncebolladoArt, BolonArt } from '../components/ui/EcuadorianArt'
import { colors, typography } from '../theme'

export function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.decoTop}>
        <EncebolladoArt size={200} />
      </View>
      <View style={styles.decoBottom}>
        <BolonArt size={180} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <LogoSalvar size={120} withWordmark />

          <View style={styles.copyBlock}>
            <Text allowFontScaling style={styles.headline}>
              Rescata sabor,{'\n'}
              <Text style={styles.headlineAccent}>protege el planeta.</Text>
            </Text>
            <Text allowFontScaling style={styles.body}>
              Salvar conecta personas y negocios locales para redistribuir excedentes alimentarios de forma
              responsable en Ecuador.
            </Text>
          </View>
        </View>

        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: colors.costa }]} />
          <View style={[styles.dot, { backgroundColor: colors.sierra }]} />
          <View style={[styles.dot, { backgroundColor: colors.oriente }]} />
          <View style={[styles.dot, { backgroundColor: colors.galapagos }]} />
        </View>

        <View style={styles.actions}>
          <PrimaryButton title="Iniciar sesión" onPress={() => router.push('/login')} className="shadow-sm" />
          <SecondaryButton title="Crear cuenta" onPress={() => router.push('/register')} />
          <Text allowFontScaling style={styles.legal}>
            Al continuar, aceptas nuestros Términos de Servicio y Política de privacidad.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  decoTop: {
    position: 'absolute',
    top: -20,
    right: -20,
    opacity: 0.1,
    transform: [{ rotate: '12deg' }]
  },
  decoBottom: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    opacity: 0.1,
    transform: [{ rotate: '-12deg' }]
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between'
  },
  hero: {
    alignItems: 'center',
    marginTop: 24
  },
  copyBlock: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 8
  },
  headline: {
    ...typography.heading1,
    textAlign: 'center',
    color: colors.text
  },
  headlineAccent: {
    ...typography.heading1,
    color: colors.primary,
    fontStyle: 'italic'
  },
  body: {
    ...typography.body,
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 340,
    lineHeight: 23
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginVertical: 28
  },
  dot: {
    height: 4,
    width: 32,
    borderRadius: 4
  },
  actions: {
    gap: 14,
    marginBottom: 12
  },
  legal: {
    ...typography.micro,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
    lineHeight: 15,
    fontWeight: '500',
    color: colors.textSecondary
  }
})

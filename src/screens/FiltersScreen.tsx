import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Slider from '@react-native-community/slider'

import { FlagStripe } from '../components/ui/FlagStripe'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { StackHeader } from '../components/ui/StackHeader'
import { priceTiers } from '../utils/marketplace'
import { colors, typography } from '../theme'

export function FiltersScreen() {
  const params = useLocalSearchParams<{
    distance?: string
    open?: string
    minRating?: string
    priceTier?: string
  }>()

  const [distance, setDistance] = useState(Number(params.distance) || 15)
  const [onlyOpen, setOnlyOpen] = useState(params.open === '1')
  const [minRating, setMinRating] = useState(Number(params.minRating) || 0)
  const [selectedPriceTier, setSelectedPriceTier] = useState(Number(params.priceTier) || 0)

  return (
    <SafeAreaView style={styles.safe}>
      <FlagStripe />
      <StackHeader title="Filtros" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text allowFontScaling style={styles.intro}>
          Ajusta cómo descubres negocios y bolsas.
        </Text>

        <View style={styles.block}>
          <View style={styles.row}>
            <Text allowFontScaling style={styles.sectionLabel}>
              Distancia máxima
            </Text>
            <Text allowFontScaling style={styles.value}>
              {Math.round(distance)} km
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={15}
            step={1}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View style={styles.sliderEnds}>
            <Text allowFontScaling style={styles.sliderEnd}>
              1 km
            </Text>
            <Text allowFontScaling style={styles.sliderEnd}>
              15 km
            </Text>
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.row}>
            <Text allowFontScaling style={styles.sectionLabel}>
              Calificación mínima
            </Text>
            <Text allowFontScaling style={styles.value}>
              {minRating === 0 ? 'Cualquiera' : `${minRating}★+`}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            value={minRating}
            onValueChange={setMinRating}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View style={styles.sliderEnds}>
            <Text allowFontScaling style={styles.sliderEnd}>
              Todas
            </Text>
            <Text allowFontScaling style={styles.sliderEnd}>
              5★
            </Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text allowFontScaling style={[styles.sectionLabel, styles.mb]}>
            Rango de precio
          </Text>
          <View style={styles.tierRow}>
            <Pressable
              onPress={() => setSelectedPriceTier(0)}
              style={[styles.tier, selectedPriceTier === 0 && styles.tierOn]}
            >
              <Text allowFontScaling style={[styles.tierText, selectedPriceTier === 0 && styles.tierTextOn]}>
                Todos
              </Text>
            </Pressable>
            {priceTiers.map((tier) => (
              <Pressable
                key={tier.value}
                onPress={() => setSelectedPriceTier(tier.value)}
                style={[styles.tier, selectedPriceTier === tier.value && styles.tierOn]}
              >
                <Text
                  allowFontScaling
                  style={[styles.tierText, selectedPriceTier === tier.value && styles.tierTextOn]}
                >
                  {tier.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text allowFontScaling style={styles.hint}>
            {selectedPriceTier === 1
              ? 'Económico (bajo $5)'
              : selectedPriceTier === 2
                ? 'Medio ($5 – $10)'
                : selectedPriceTier === 3
                  ? 'Premium (más de $10)'
                  : 'Cualquier presupuesto'}
          </Text>
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleText}>
            <Text allowFontScaling style={styles.toggleTitle}>
              Solo abiertos ahora
            </Text>
            <Text allowFontScaling style={styles.toggleSub}>
              Negocios que aceptan reservas hoy.
            </Text>
          </View>
          <Switch
            value={onlyOpen}
            onValueChange={setOnlyOpen}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.surface}
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Aplicar filtros"
            onPress={() =>
              router.replace({
                pathname: '/inicio',
                params: {
                  distance: String(Math.round(distance)),
                  open: onlyOpen ? '1' : '0',
                  minRating: String(minRating),
                  priceTier: String(selectedPriceTier)
                }
              })
            }
          />
          <SecondaryButton
            title="Restablecer"
            onPress={() => {
              setDistance(15)
              setOnlyOpen(false)
              setMinRating(0)
              setSelectedPriceTier(0)
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
    gap: 28
  },
  intro: {
    ...typography.body,
    lineHeight: 22
  },
  block: {
    gap: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  sectionLabel: {
    ...typography.overline,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  mb: {
    marginBottom: 12
  },
  value: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary
  },
  slider: {
    width: '100%',
    height: 40
  },
  sliderEnds: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sliderEnd: {
    ...typography.micro
  },
  tierRow: {
    flexDirection: 'row',
    gap: 10
  },
  tier: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center'
  },
  tierOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  tierText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text
  },
  tierTextOn: {
    color: '#FFFFFF'
  },
  hint: {
    ...typography.micro,
    marginTop: 8,
    fontStyle: 'italic',
    marginLeft: 2
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.muted,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16
  },
  toggleText: {
    flex: 1,
    minWidth: 0
  },
  toggleTitle: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  toggleSub: {
    ...typography.caption,
    marginTop: 4
  },
  actions: {
    gap: 12,
    paddingTop: 8
  }
})

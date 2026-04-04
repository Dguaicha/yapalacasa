import { StyleSheet, Text, View } from 'react-native'

import { colors, typography } from '../../theme'

type Props = {
  title: string
  subtitle?: string
}

export function AppHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <Text allowFontScaling style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text allowFontScaling style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      <View style={styles.stripe}>
        <View style={[styles.stripeSeg, { backgroundColor: colors.ecuadorYellow }]} />
        <View style={[styles.stripeSeg, { backgroundColor: colors.ecuadorBlue }]} />
        <View style={[styles.stripeSeg, { backgroundColor: colors.ecuadorRed }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 24
  },
  title: {
    ...typography.heading1,
    color: colors.text
  },
  subtitle: {
    ...typography.body,
    marginTop: 6,
    lineHeight: 22
  },
  stripe: {
    flexDirection: 'row',
    height: 4,
    width: 56,
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden'
  },
  stripeSeg: {
    flex: 1
  }
})

import { View } from 'react-native'

import { colors } from '../../theme'

export function FlagStripe() {
  return (
    <View style={{ flexDirection: 'row', height: 3 }}>
      <View style={{ flex: 1, backgroundColor: colors.ecuadorYellow }} />
      <View style={{ flex: 1, backgroundColor: colors.ecuadorBlue }} />
      <View style={{ flex: 1, backgroundColor: colors.ecuadorRed }} />
    </View>
  )
}

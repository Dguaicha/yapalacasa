import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'

import { colors, typography } from '../../theme'

interface Props extends TextInputProps {
  label: string
  error?: string | null
}

export function TextInputField({ label, error, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text allowFontScaling style={styles.label}>
        {label}
      </Text>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          {...props}
        />
      </View>
      {error ? (
        <Text allowFontScaling style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
    gap: 6
  },
  label: {
    ...typography.overline,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  field: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  fieldError: {
    borderColor: colors.error
  },
  input: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.text,
    padding: 0,
    margin: 0
  },
  error: {
    ...typography.micro,
    color: colors.error,
    marginLeft: 4,
    fontWeight: '500'
  }
})

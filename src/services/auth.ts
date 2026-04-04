import type { EmailOtpType } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import { Platform } from 'react-native'

export type CallbackParams = {
  accessToken: string | null
  code: string | null
  refreshToken: string | null
  tokenHash: string | null
  type: EmailOtpType | null
}

export function getAuthRedirectUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`
  }

  return Linking.createURL('/auth/callback')
}

export function getAuthCallbackParams(rawUrl?: string | null): CallbackParams {
  const href =
    rawUrl || (Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.href : '')

  if (!href) {
    return {
      accessToken: null,
      code: null,
      refreshToken: null,
      tokenHash: null,
      type: null
    }
  }

  const url = new URL(href)
  const searchParams = url.searchParams
  const hashParams = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : url.hash)
  const typeValue = searchParams.get('type') ?? hashParams.get('type')

  return {
    accessToken: searchParams.get('access_token') ?? hashParams.get('access_token'),
    code: searchParams.get('code') ?? hashParams.get('code'),
    refreshToken: searchParams.get('refresh_token') ?? hashParams.get('refresh_token'),
    tokenHash: searchParams.get('token_hash') ?? hashParams.get('token_hash'),
    type: (typeValue as EmailOtpType | null) ?? null
  }
}

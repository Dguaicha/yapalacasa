import { colors } from '../../theme'
import { LogoSalvarSVG } from './LogoSalvarSVG'

type Props = {
  size?: number
  withWordmark?: boolean
}

export function LogoSalvar({ size = 68, withWordmark = false }: Props) {
  return <LogoSalvarSVG size={size} withWordmark={withWordmark} color={colors.brandMark} />
}

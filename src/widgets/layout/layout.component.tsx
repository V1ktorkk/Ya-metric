import clsx from 'clsx'
import { Footer, Header, Main } from './ui'

type LayoutProps = React.ComponentPropsWithoutRef<'div'>

export function Layout(props: LayoutProps) {
  const { className, children, ...otherProps } = props

  return (
    <div className={clsx('grid min-h-dvh grid-rows-layout bg-black', className)} {...otherProps}>
      {children}
    </div>
  )
}

Layout.Header = Header
Layout.Main = Main
Layout.Footer = Footer

import { Layout } from '@widgets/layout'
import { ResumeContact } from '../../components/ResumeContact'

export function HomePage() {
  return (
    <Layout>
      <Layout.Main>
        <ResumeContact />
      </Layout.Main>
    </Layout>
  )
}

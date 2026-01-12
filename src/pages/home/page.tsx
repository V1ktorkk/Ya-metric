import { Layout } from '@widgets/layout'
import { ProjectsSection } from '../../components/ProjectsSection'
import { ResumeContact } from '../../components/ResumeContact'

export function HomePage() {
  return (
    <Layout>
      <Layout.Main>
        <ResumeContact />
        <ProjectsSection />
      </Layout.Main>
    </Layout>
  )
}

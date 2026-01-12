interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  icon: string
}

const WEB3_PROJECTS: Project[] = [
  {
    id: 'staking-platform',
    title: 'Платформа для стейкинга',
    description:
      'Децентрализованная платформа для стейкинга токенов. Реализована на Solidity с использованием паттерна factory для управления пулами стейкинга и распределением вознаграждений.',
    technologies: ['Solidity', 'Factory Pattern', 'EVM'],
    icon: '🪙',
  },
  {
    id: 'hyperledger-blockchain',
    title: 'Приватный блокчейн на Hyperledger Besu',
    description:
      'Развертывание и конфигурация собственной приватной сети блокчейна. Интеграция с развертыванием смарт-контрактов в приватной сети и взаимодействие с функциями контрактов внутри сети.',
    technologies: ['Hyperledger Besu', 'Private Networks', 'Smart Contracts'],
    icon: '⛓️',
  },
  {
    id: 'charity-platform',
    title: 'Децентрализованная платформа благотворительности',
    description:
      'Платформа для прозрачного управления благотворительными пожертвованиями. Обеспечивает полную прозрачность, подотчетность и автоматизацию благотворительных транзакций через смарт-контракты.',
    technologies: ['Solidity', 'Smart Contracts', 'Transparency'],
    icon: '🤝',
  },
]

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="w-full border-t border-slate-700 px-3 py-6 sm:px-4 sm:py-10 md:px-6 md:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">📦 Web3 Проекты</h2>
          <p className="text-sm text-slate-400 sm:text-base">
            Опыт разработки децентрализованных приложений и смарт-контрактов
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {WEB3_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group transform rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition duration-300 hover:border-teal-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-teal-500/10 sm:p-5 md:p-6"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 text-3xl">{project.icon}</div>
                  <h3 className="text-base font-semibold text-white sm:text-lg">{project.title}</h3>
                </div>
              </div>

              <p className="mb-4 text-xs leading-relaxed text-slate-400 sm:text-sm">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-block rounded-full bg-teal-500/15 px-2.5 py-1 text-xs font-medium text-teal-300 group-hover:bg-teal-500/25 group-hover:text-teal-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12 md:mt-16">
          <p className="mb-4 text-sm text-slate-400 sm:text-base">
            Заинтересованы в сотрудничестве или хотите узнать больше? Заполняйте форму сверху!
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TermsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export function TermsDialog({
  open,
  onOpenChange,
  onAccept,
}: TermsDialogProps) {
  // Estado para controlar se o botão pode ser habilitado/exibido
  const [canAccept, setCanAccept] = useState(false)
  // Ref para o elemento ScrollArea principal (wrapper)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleAccept = () => {
    onAccept()
  }

  // Função que verifica a posição do scroll e atualiza o estado
  const checkScrollPosition = useCallback(() => {
    if (!scrollAreaRef.current) return

    // Tenta encontrar a viewport do Radix, que é o elemento que realmente rola
    const viewport = scrollAreaRef.current.querySelector(
      '[data-radix-scroll-area-viewport]',
    ) as HTMLDivElement | null

    if (!viewport) return

    // Calcula se chegou ao final
    const { scrollHeight, scrollTop, clientHeight } = viewport

    // A margem de erro de 1px é para cobrir pequenas imprecisões de renderização
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1

    if (isAtBottom && !canAccept) {
      setCanAccept(true)
    } else if (!isAtBottom && canAccept) {
      setCanAccept(false)
    }
  }, [canAccept])

  // Efeito que anexa e remove o listener de scroll na viewport correta
  useEffect(() => {
    // Se o modal não estiver aberto, não faz nada
    if (!open) return

    // Usa setTimeout para garantir que o DOM foi renderizado antes de buscar a viewport
    const timeoutId = setTimeout(() => {
      const viewport = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]',
      ) as HTMLDivElement | null

      if (viewport) {
        // 1. Anexa o listener de scroll ao elemento viewport
        viewport.addEventListener('scroll', checkScrollPosition)

        // 2. Verifica a posição imediatamente (importante para conteúdo curto)
        checkScrollPosition()

        // 3. Limpa o listener ao desmontar ou fechar
        return () => {
          viewport.removeEventListener('scroll', checkScrollPosition)
        }
      }
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [open, checkScrollPosition])

  return (
    // IMPORTANTE: Para resetar o estado `canAccept` para false ao reabrir,
    // o componente pai DEVE usar a prop `key` baseada no estado `open`.
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Termos e Políticas da Onde Hoje</DialogTitle>
          <DialogDescription>
            Por favor, leia nossos termos de uso, diretrizes da comunidade e
            política de privacidade antes de continuar.
          </DialogDescription>
        </DialogHeader>

        {/* Adiciona a referência ao ScrollArea wrapper */}
        <ScrollArea className="grid max-h-[60vh] gap-4" ref={scrollAreaRef}>
          <div className="space-y-6 text-sm">
            {/*
             *
             * SEÇÃO 1: TERMOS DE USO (EXISTENTE)
             *
             */}
            <h2 className="text-xl font-bold">Termos de Uso</h2>
            <div className="space-y-4">
              <section>
                <h3 className="mb-2 font-semibold">1. Aceitação dos Termos</h3>
                <p className="text-muted-foreground">
                  Ao acessar e usar este sistema de eventos, você concorda em
                  cumprir e estar vinculado aos seguintes termos e condições de
                  uso.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">2. Uso do Serviço</h3>
                <p className="text-muted-foreground">
                  Este serviço é fornecido para gerenciamento de eventos e deve
                  ser utilizado apenas para fins legítimos. Você concorda em
                  <strong>
                    {' '}
                    não usar o serviço para qualquer propósito ilegal
                  </strong>
                  ou não autorizado.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">3. Privacidade e Dados</h3>
                <p className="text-muted-foreground">
                  Respeitamos sua privacidade. Coletamos apenas as informações
                  necessárias para fornecer nossos serviços. Suas informações
                  pessoais{' '}
                  <strong>não serão compartilhadas com terceiros</strong>
                  sem seu consentimento explícito.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">4. Conta de Usuário</h3>
                <p className="text-muted-foreground">
                  Você é responsável por manter a confidencialidade de sua conta
                  e senha. Você concorda em aceitar{' '}
                  <strong>responsabilidade por todas as atividades</strong> que
                  ocorrem sob sua conta.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">5. Conteúdo do Usuário</h3>
                <p className="text-muted-foreground">
                  Você concede uma licença para usar, modificar e exibir o
                  conteúdo conforme necessário para fornecer os serviços. Você
                  <strong> mantém todos os direitos</strong> sobre o conteúdo
                  que envia.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  6. Limitação de Responsabilidade
                </h3>
                <p className="text-muted-foreground">
                  O serviço é fornecido &quot;como está&quot; sem garantias de
                  qualquer tipo. <strong>Não nos responsabilizamos</strong> por
                  quaisquer danos diretos, indiretos, incidentais ou
                  consequenciais.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  7. Modificações dos Termos
                </h3>
                <p className="text-muted-foreground">
                  Reservamos o direito de{' '}
                  <strong>modificar estes termos a qualquer momento</strong>. As
                  alterações entrarão em vigor imediatamente após a publicação.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">8. Cancelamento</h3>
                <p className="text-muted-foreground">
                  Podemos encerrar ou suspender seu acesso ao serviço
                  <strong> imediatamente</strong>, se você violar os Termos.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">9. Lei Aplicável</h3>
                <p className="text-muted-foreground">
                  Estes Termos serão regidos e interpretados de acordo com as
                  <strong> leis do Brasil</strong>.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">10. Contato</h3>
                <p className="text-muted-foreground">
                  Se você tiver alguma dúvida sobre estes Termos, entre em
                  contato conosco através dos canais de suporte disponíveis.
                </p>
              </section>
            </div>

            <hr className="my-6" />

            {/*
             *
             * SEÇÃO 2: DIRETRIZES DA COMUNIDADE (NOVA - DETALHADA)
             *
             */}
            <h2 className="text-xl font-bold">Diretrizes da Comunidade</h2>
            <div className="space-y-4">
              <section>
                <h3 className="mb-2 font-semibold">
                  1. Moderação de Conteúdos
                </h3>
                <p className="text-muted-foreground">
                  A Onde Hoje oferece uma plataforma digital que permite que
                  anunciantes — como organizadores de eventos e proprietários de
                  estabelecimentos — criem, divulguem e gerenciem anúncios e
                  eventos. Os conteúdos publicados pelos anunciantes têm como
                  finalidade apenas atingir esses objetivos dentro da
                  plataforma. A Onde Hoje <strong>não se responsabiliza</strong>{' '}
                  por aspectos relacionados à produção, execução, veracidade,
                  qualidade, quantidade, entrega, atendimento, segurança ou
                  quaisquer outros fatores vinculados aos eventos, produtos,
                  serviços ou estabelecimentos divulgados. Assim, a moderação de
                  conteúdos se refere <strong>exclusivamente</strong>à ação da
                  Onde Hoje de revisar, suspender, remover ou ajustar
                  publicações feitas pelos anunciantes na plataforma.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  2.1 Critérios de Moderação
                </h3>
                <p className="text-muted-foreground">
                  Além dos Termos de Uso Gerais e de outras políticas, a Onde
                  Hoje adota critérios específicos para orientar o processo de
                  análise e moderação de conteúdos, visando manter um ambiente
                  seguro, transparente e em conformidade com a legislação
                  vigente. Os conteúdos sujeitos à moderação são organizados
                  conforme os temas abaixo:
                </p>
                <ul className="text-muted-foreground ml-4 list-disc space-y-2">
                  <li>
                    <strong>2.1.1 Propriedade Intelectual:</strong> É{' '}
                    <strong>proibido</strong> publicar qualquer conteúdo que
                    viole direitos de propriedade intelectual de terceiros.
                  </li>
                  <li>
                    <strong>2.1.2 Publicidade Enganosa ou Abusiva:</strong> Não
                    são permitidos conteúdos que promovam publicidade enganosa
                    (informações falsas ou que induzam o usuário a erro) ou
                    abusiva (discriminatória, que explore medo/superstição, ou
                    que incentive práticas prejudiciais).
                  </li>
                  <li>
                    <strong>2.1.3 Incitação à Violência ou Intimidação:</strong>{' '}
                    Conteúdos que ameacem, humilhem, insultem ou intimidem
                    indivíduos ou grupos <strong>não serão aceitos</strong>.
                  </li>
                  <li>
                    <strong>2.1.4 Terrorismo:</strong> Não é permitido publicar
                    conteúdos vinculados a grupos terroristas, ou que promovam
                    recrutamento, radicalização ou atos ilegais e violentos.
                  </li>
                  <li>
                    <strong>2.1.5 Produtos e Serviços Proibidos:</strong> Não
                    são autorizadas publicações de drogas ilícitas, derivados de
                    tabaco e nicotina, armas de fogo, explosivos, apostas,
                    serviços sexuais ou serviços profissionais que exijam
                    registro específico.
                  </li>
                  <li>
                    <strong>2.1.7 Nudez e Conteúdos Sexuais:</strong> Não são
                    aceitos conteúdos pornográficos ou sexualmente explícitos
                    (atos sexuais, nudez sexualizada, serviços eróticos).
                    Exceções para conteúdos artísticos, acadêmicos, científicos
                    ou educativos, desde que <strong>sem sexualização</strong>.
                  </li>
                  <li>
                    <strong>2.1.8 Discurso de Ódio:</strong> Conteúdos que
                    promovam ódio ou discriminação por raça, etnia, gênero,
                    orientação sexual, política, religião, idade, deficiência ou
                    qualquer outra condição são <strong>proibidos</strong>.
                  </li>
                  <li>
                    <strong>2.1.9 Desinformação (Fake News):</strong> Não é
                    permitido publicar informações comprovadamente falsas ou
                    enganosas que possam prejudicar a saúde pública, segurança
                    ou processos democráticos.
                  </li>
                  <li>
                    <strong>
                      2.1.10 Conteúdos Gerados por Inteligência Artificial:
                    </strong>
                    Mídias manipuladas por IA com intenção de enganar ou
                    prejudicar terceiros não são permitidas. Imagens geradas por
                    IA devem
                    <strong> indicar quando se tratam de ilustrações</strong>.
                  </li>
                  <li>
                    <strong>
                      2.1.13 Práticas de Marketing Ilegal e Estelionato:
                    </strong>
                    Não é permitido divulgar pirâmides, fraudes, golpes ou
                    práticas enganosas que obtenham vantagem ilícita.
                  </li>
                  <li>
                    <strong>2.1.14 Eventos Ilegais ou Irregulares:</strong> A
                    publicação de eventos que descumpram normas municipais,
                    estaduais ou protocolos de segurança e saúde é{' '}
                    <strong>proibida</strong>.
                  </li>
                  <li>
                    <strong>2.1.15 Pagamentos Fora da Plataforma:</strong> Não
                    são permitidas{' '}
                    <strong>transações financeiras externas</strong> à Onde
                    Hoje.
                  </li>
                  <li>
                    <strong>2.1.18 Produtos e Serviços Financeiros:</strong> É{' '}
                    <strong>proibida</strong> a divulgação de serviços
                    financeiros (empréstimos, câmbio, seguros, investimentos).
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">3. Análise de Conteúdos</h3>
                <p className="text-muted-foreground">
                  A Onde Hoje avalia conteúdos considerando princípios legais,
                  contexto e impacto público. A análise pode incluir outras
                  publicações do mesmo anunciante, inclusive fora da plataforma.
                  Para conteúdos destinados a adultos, é{' '}
                  <strong>obrigatório informar a classificação etária</strong>{' '}
                  de forma clara.
                </p>
                <p className="text-muted-foreground">
                  Conteúdos artísticos, educativos ou científicos devem
                  apresentar: Propósito e contexto histórico, Explicações e
                  objetivos, Indicação de apoio institucional ou cultural,
                  Avisos de classificação indicativa e Ajustes visuais (ex.:
                  desfoque ou censura).
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">4. Denúncias</h3>
                <p className="text-muted-foreground">
                  Qualquer pessoa pode denunciar conteúdos ilegais ou impróprios
                  pelo email <strong>ondehoje.sac@gmail.com</strong>. Apenas
                  denúncias recebidas por esse meio serão analisadas.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  5. Remoção de Conteúdos, Suspensão e Exclusão de Contas
                </h3>
                <p className="text-muted-foreground">
                  Violação das políticas pode resultar em remoção de conteúdo ou
                  exclusão de contas. Infrações graves ou reincidentes podem
                  levar à <strong>exclusão definitiva</strong> da conta.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">6. Apelação</h3>
                <p className="text-muted-foreground">
                  O anunciante pode recorrer em até <strong>48 horas</strong>{' '}
                  após notificação. O painel independente analisará a apelação
                  em até <strong>72 horas</strong>, podendo resultar em
                  Publicação integral, Publicação com ajustes ou Remoção
                  definitiva. O recurso deve ser tratado pelo email{' '}
                  <strong>ondehoje.sac@gmail.com</strong>.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">7. Efeitos Legais</h3>
                <p className="text-muted-foreground">
                  As decisões da Onde Hoje são definitivas dentro do uso da
                  plataforma, sem prejuízo de o usuário recorrer a vias
                  judiciais cabíveis.
                </p>
              </section>
            </div>

            <hr className="my-6" />

            {/*
             *
             * SEÇÃO 3: POLÍTICA DE PRIVACIDADE (NOVA - DETALHADA)
             *
             */}
            <h2 className="text-xl font-bold">Política de Privacidade</h2>
            <div className="space-y-4">
              <section>
                <h3 className="mb-2 font-semibold">
                  1. Obtenção de informações pessoais e não pessoais
                </h3>
                <p className="text-muted-foreground">
                  Ao utilizar as soluções tecnológicas, a Onde Hoje coletará
                  <strong> dados pessoais das Empresas</strong> (Organizadores)
                  para garantir a veracidade e conformidade legal, podendo
                  consultar fontes externas e solicitar documentos de
                  identificação.
                </p>
                <p className="text-muted-foreground">
                  O **Consumidor** realiza login social utilizando o{' '}
                  <strong>Google</strong>, autorizando o acesso a informações
                  como nome e endereço de e-mail. Além disso, a Onde Hoje coleta
                  dados de <strong>geolocalização</strong> e dados do{' '}
                  <strong>dispositivo</strong> (endereço IP, tipo de navegador,
                  modelo, etc.).
                </p>
                <p className="text-muted-foreground">
                  A Onde Hoje poderá solicitar **documentos pessoais** diante da
                  identificação de <strong>atividades suspeitas</strong> que
                  apresentem risco significativo de fraude, com o objetivo de
                  confirmar a identidade do usuário.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  2. Utilização das informações pessoais
                </h3>
                <p className="text-muted-foreground">
                  Os dados pessoais serão utilizados para{' '}
                  <strong>prover, desenvolver e aperfeiçoar os serviços</strong>
                  , incluindo a realização de cadastro e acesso aos eventos
                  ofertados pelos Organizadores.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  3. Compartilhamento de informações pessoais
                </h3>
                <p className="text-muted-foreground">
                  A Onde Hoje poderá compartilhar dados:
                </p>
                <ul className="text-muted-foreground ml-4 list-disc space-y-2">
                  <li>
                    Com <strong>empresas do mesmo grupo econômico</strong> para
                    desenvolvimento de produtos e oferta de serviços.
                  </li>
                  <li>
                    Com <strong>contratados e prestadores de serviços</strong>{' '}
                    (ex: agências de marketing, processadores de pagamento) que
                    tratem dados em nome da empresa.
                  </li>
                  <li>
                    Com <strong>autoridades policiais ou judiciais</strong>{' '}
                    (quando requerido pela legislação, por decisão judicial ou
                    para investigações).
                  </li>
                  <li>
                    Com <strong>terceiros</strong> se a atividade do usuário for
                    considerada <strong>suspeita, ilegal ou prejudicial</strong>
                    .
                  </li>
                </ul>
              </section>
            </div>

            <hr className="my-6" />

            {/*
             *
             * SEÇÃO 4: OBRIGAÇÕES ADICIONAIS E RESPONSABILIDADE (DETALHADA)
             *
             */}
            <h2 className="text-xl font-bold">
              Obrigações e Disposições de Responsabilidade
            </h2>
            <div className="space-y-4">
              <section>
                <h3 className="mb-2 font-semibold">
                  1. Obrigações dos Usuários ao se Cadastrarem na Plataforma
                </h3>
                <p className="text-muted-foreground">
                  A Plataforma pode ter Conteúdos para Todas as Faixas Etárias,
                  e o Usuário declara estar ciente que determinados conteúdos
                  podem não ser adequados para menores de idade, sendo de{' '}
                  <strong>responsabilidade exclusiva do Usuário</strong>{' '}
                  realizar a supervisão ou controle de acesso.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  2. Obrigações das Empresas ao Cadastrarem Eventos
                </h3>
                <p className="text-muted-foreground">
                  Ao criar eventos, a Empresa deve garantir a{' '}
                  <strong>Veracidade e Completude das Informações</strong>,
                  possuir os{' '}
                  <strong>Direitos e Capacidade de Cumprimento</strong>
                  do evento anunciado (sob pena de incorrer em publicidade
                  enganosa) e a{' '}
                  <strong>Conformidade com as Diretrizes de Comunidade</strong>.
                </p>
                <p className="text-muted-foreground">
                  A Empresa tem <strong>total responsabilidade</strong> por
                  Links Externos postados e reconhece que a organização e
                  realização do evento são de sua{' '}
                  <strong>Responsabilidade Exclusiva</strong>. A Empresa deve{' '}
                  <strong>Isentar a Onde Hoje</strong> de qualquer
                  responsabilidade civil, penal ou administrativa e se
                  compromete a <strong>arcar com todos os custos</strong> de
                  demandas judiciais (honorários, custas, indenizações) contra a
                  Plataforma.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  3. Disposições sobre Responsabilidade
                </h3>
                <p className="text-muted-foreground">
                  A Onde Hoje{' '}
                  <strong>não é responsável pelas Ações dos Usuários</strong>
                  (atos ilícitos, imorais ou antiéticos). Os usuários declaram
                  que a Onde Hoje{' '}
                  <strong>não possui qualquer responsabilidade</strong>
                  sobre Ocorrências e Incidentes em Períodos de Calamidade, como
                  contágio de doenças.
                </p>
                <p className="text-muted-foreground">
                  Em nenhuma hipótese a Onde Hoje responderá por Indenizações e
                  Danos Relacionados a Eventos (materiais, morais, lucros
                  cessantes), sendo tal responsabilidade
                  <strong> integralmente atribuída à Empresa</strong>.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">
                  4. Direitos de Propriedade Intelectual e Responsabilidade
                  sobre Conteúdo
                </h3>
                <p className="text-muted-foreground">
                  Ao publicar, o usuário concede uma **Licença de Publicação**
                  gratuita e irrevogável, e oferece a **Garantia de Direitos
                  Autorais**, sendo o <strong>único responsável</strong> pelo
                  conteúdo de suas publicações. O usuário assume total
                  <strong> Responsabilidade por Danos e Prejuízos</strong> que a
                  Onde Hoje venha a incorrer. Conflitos de Propriedade
                  Intelectual deverão ser conduzidos entre a Empresa e o
                  terceiro, permanecendo a Onde Hoje{' '}
                  <strong>completamente isenta</strong>
                  de envolvimento.
                </p>
              </section>
            </div>
          </div>

          <Button
            onClick={handleAccept}
            className="my-4 w-full"
            disabled={!canAccept}
          >
            Aceitar Termos e Políticas
          </Button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

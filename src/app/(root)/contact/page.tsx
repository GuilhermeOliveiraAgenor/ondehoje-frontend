import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Fale Conosco - Onde Hoje',
  description: 'Entre em contato conosco. Estamos aqui para ajudar!',
}

export default function ContatoPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-12 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            Fale Conosco
          </h1>
          <p className="text-lg font-light opacity-90">
            Estamos aqui para ajudar você. Entre em contato!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Email Highlight Card */}
        <Card className="border-primary from-primary/5 to-primary/10 mb-8 border-2 bg-gradient-to-br shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Mail className="text-primary-foreground h-8 w-8" />
            </div>
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Email Principal
            </h2>
            <p className="text-muted-foreground mb-4">
              Para dúvidas, sugestões ou suporte, envie um email para:
            </p>
            <a
              href="mailto:ondehoje.sac@gmail.com"
              className="text-primary hover:text-primary/80 mb-2 inline-block text-3xl font-bold transition-colors sm:text-4xl"
            >
              ondehoje.sac@gmail.com
            </a>
            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                <a href="mailto:ondehoje.sac@gmail.com">Enviar Email</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Methods Grid */}
        <div className="mb-12">
          <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
            Outras Formas de Contato
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* WhatsApp Card */}
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <MessageSquare className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  WhatsApp
                </h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  Fale conosco pelo WhatsApp
                </p>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full bg-transparent"
                  asChild
                >
                  <a
                    href="https://wa.me/5541987640508"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Phone className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  Telefone
                </h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  Ligue para nosso suporte
                </p>
                <a
                  href="tel:+5511999999999"
                  className="text-primary block text-lg font-semibold hover:underline"
                >
                  (41) 98764-0508
                </a>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <MapPin className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  Endereço
                </h3>
                <p className="text-muted-foreground text-sm">
                  Curitiba, PR
                  <br />
                  Brasil
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground mb-2 font-semibold">
                  Qual o horário de atendimento?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Respondemos emails de segunda a sexta, das 9h às 18h.
                </p>
              </div>
              <div>
                <h3 className="text-foreground mb-2 font-semibold">
                  Quanto tempo leva para receber uma resposta?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Normalmente respondemos em até 24 horas úteis.
                </p>
              </div>
              <div>
                <h3 className="text-foreground mb-2 font-semibold">
                  Como faço para divulgar meu evento?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Entre em contato pelo email{' '}
                  <a
                    href="mailto:ondehoje.sac@gmail.com"
                    className="text-primary font-semibold hover:underline"
                  >
                    ondehoje.sac@gmail.com
                  </a>{' '}
                  com os detalhes do seu evento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

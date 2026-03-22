'use client'

import { CheckCircle2, Megaphone, XCircle } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Advertisement } from '@/modules/advertisement/types/advertisement'

import { ApproveAdvertisementDialog } from './approve-advertisement-dialog'
import { RejectAdvertisementDialog } from './reject-advertisement-dialog'

interface EvaluateAdvertisementsSheetProps {
  advertisements: Advertisement[]
}

export function EvaluateAdvertisementsSheet({
  advertisements,
}: EvaluateAdvertisementsSheetProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Megaphone className="mr-2 h-4 w-4" />
          Anúncios ({advertisements.length})
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="min-h-screen w-full overflow-y-auto p-6 md:max-w-1/2"
      >
        <SheetHeader>
          <SheetTitle>Anúncios do Evento</SheetTitle>
          <SheetDescription>
            Avalie e gerencie os anúncios deste evento
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {advertisements.map((ad) => (
            <div key={ad.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{ad.company.name}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {ad.description}
                  </p>
                </div>
                <Badge variant="outline">{ad.status}</Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Dias:</span>
                  <span className="ml-2 font-medium">{ad.days}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="ml-2 font-medium">
                    R$ {ad.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {ad.status === 'Aguardando autorização' && (
                <>
                  <Separator />

                  <div className="grid space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Este anúncio está aguardando sua autorização.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1"
                        onClick={() => setShowApproveDialog(!showApproveDialog)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Aprovar
                      </Button>

                      {showApproveDialog && (
                        <Dialog
                          defaultOpen={showApproveDialog}
                          onOpenChange={setShowApproveDialog}
                        >
                          <ApproveAdvertisementDialog advertisement={ad} />
                        </Dialog>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => setShowRejectDialog(!showRejectDialog)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeitar
                      </Button>

                      {showRejectDialog && (
                        <Dialog
                          defaultOpen={showRejectDialog}
                          onOpenChange={setShowRejectDialog}
                        >
                          <RejectAdvertisementDialog advertisement={ad} />
                        </Dialog>
                      )}
                    </div>
                  </div>
                </>
              )}

              {ad.advertisementAuthorizations.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      Lista de Autorizações:
                    </h4>
                    {ad.advertisementAuthorizations.map((auth) => (
                      <div
                        key={auth.id}
                        className="bg-muted rounded-md p-3 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            Status: {auth.status}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(auth.decidedAt).toLocaleDateString(
                              'pt-BR',
                            )}
                          </span>
                        </div>
                        {auth.rejectedReason && (
                          <p className="text-muted-foreground mt-2">
                            <span className="font-medium">Motivo:</span>{' '}
                            {auth.rejectedReason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Última atualização:{' '}
            {new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

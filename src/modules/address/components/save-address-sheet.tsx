import { Row } from '@tanstack/react-table'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { Lineaction } from '@/components/table/types/lineaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useFormState } from '@/hooks/use-form-state'
import { getFieldError } from '@/utils/get-field-error'
import { maskCep } from '@/utils/masks'

import { Address } from '../types/address'
import { createAddressAction, editAddressAction } from './actions'

export function SaveAddressSheet({
  lineaction,
  row,
}: {
  lineaction?: Lineaction
  row?: Row<Address>
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { icon: Icon } = lineaction || {}
  const { original: address } = row || { original: undefined }

  console.log('address', address)

  const [latitude, setLatitude] = useState(address?.latitude ?? 0)
  const [longitude, setLongitude] = useState(address?.longitude ?? 0)
  const [cep, setCep] = useState(address?.cep ? maskCep(address.cep) : '')
  const [showInvalidCep, setShowInvalidCep] = useState(false)
  const [street, setStreet] = useState(address?.street || '')
  const [complement, setComplement] = useState(address?.complement || '')
  const [number, setNumber] = useState(address?.number || '')
  const [neighborhood, setNeighborhood] = useState(address?.neighborhood || '')
  const [city, setCity] = useState(address?.city || '')
  const [state, setState] = useState(address?.state || '')

  function handlePositionMarkerChange(latitude: number, longitude: number) {
    setLatitude(latitude)
    setLongitude(longitude)
  }

  async function handleCepSearch() {
    const unmaskedCep = cep.replace(/\D/g, '')
    if (unmaskedCep.length !== 8) return

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${unmaskedCep}/json/`,
      )
      if (response.data.logradouro) {
        setStreet(response.data.logradouro)
        setNeighborhood(response.data.bairro)
        setCity(response.data.localidade)
        setState(response.data.uf)
      } else {
        setShowInvalidCep(true)
      }
    } catch (error) {
      setShowInvalidCep(true)
      console.error('Erro ao buscar CEP', error)
    }
  }

  async function findAddressOnMap() {
    const query = `${street}, ${number}, ${city}, ${state}, Brasil`

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
      )

      if (response.data && response.data.length > 0) {
        const bestResult = response.data[0]
        const lat = parseFloat(bestResult.lat)
        const lon = parseFloat(bestResult.lon)

        setLatitude(lat)
        setLongitude(lon)
      } else {
        alert('Endereço não encontrado no mapa.')
      }
    } catch (error) {
      console.error('Erro no geocoding:', error)
    }
  }

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/maps/map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  )

  const formAction = address ? editAddressAction : createAddressAction

  const [{ errors, success }, handleSubmit, isPending] =
    useFormState(formAction)

  useEffect(() => {
    if (success) {
      setOpen(false)
      router.refresh()
    }
  }, [success, router, setOpen])

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger className="flex w-full items-center justify-center gap-2 px-2 py-1.5 text-sm">
        {Icon ? (
          <Icon
            style={{
              width: 16,
              height: 16,
            }}
          />
        ) : undefined}
        {lineaction?.label}
      </SheetTrigger>
      <SheetContent className="grid min-h-screen w-full gap-4 overflow-y-auto p-6 md:max-w-1/2">
        <SheetHeader>
          <SheetTitle>Salvar Endereço</SheetTitle>
        </SheetHeader>
        <form className="grid space-y-4 p-4" action={handleSubmit}>
          <input type="hidden" name="id" value={address?.id} />

          <div className="h-52 items-center justify-center rounded-md">
            <Map
              onPositionMarkerChange={handlePositionMarkerChange}
              latitude={latitude}
              longitude={longitude}
            />
          </div>
          <input type="hidden" name="latitude" value={latitude} />
          <input type="hidden" name="longitude" value={longitude} />
          <div className="grid gap-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              name="cep"
              placeholder="CEP"
              autoComplete="off"
              value={cep}
              onChange={(e) => setCep(maskCep(e.target.value))}
              onBlur={handleCepSearch}
              maxLength={9}
            />
            {showInvalidCep && <Label>CEP Inválido.</Label>}

            <Button type="button" variant="outline" onClick={findAddressOnMap}>
              Buscar endereço no mapa
            </Button>
            {getFieldError(errors, 'cep') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'cep')}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              name="street"
              placeholder="Rua"
              autoComplete="off"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            {getFieldError(errors, 'street') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'street')}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              placeholder="Bairro"
              autoComplete="off"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />

            {getFieldError(errors, 'neighborhood') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'neighborhood')}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              name="number"
              placeholder="Número"
              autoComplete="off"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            {getFieldError(errors, 'number') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'number')}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="complement">complemento</Label>
            <Input
              id="complement"
              name="complement"
              placeholder="Complemento"
              autoComplete="off"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />

            {getFieldError(errors, 'complement') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'complement')}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              name="state"
              placeholder="Estado"
              autoComplete="off"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />

            {getFieldError(errors, 'state') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'state')}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              name="city"
              placeholder="Cidade"
              autoComplete="off"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            {getFieldError(errors, 'city') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'city')}
              </p>
            )}
          </div>

          <SheetFooter className="justify-end p-0 sm:flex-row">
            <Button type="submit">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Salvar Endereço'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

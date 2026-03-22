'use client'

import { useEffect, useState, useTransition } from 'react'

import { TermsDialog } from '@/components/auth/terms-dialogs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Label } from '@/components/ui/label'

import { signInWithGoogle } from './actions'

const TERMS_COOKIE_NAME = 'terms_accepted'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  if (days) {
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  } else {
    expires.setTime(expires.getTime() - 1000)
  }
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export function SignInForm() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [isPending] = useTransition()

  useEffect(() => {
    const accepted = getCookie(TERMS_COOKIE_NAME) === 'true'
    if (accepted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTermsAccepted(true)
    }
  }, [])

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setShowTermsDialog(true)
    } else {
      setTermsAccepted(false)
      setCookie(TERMS_COOKIE_NAME, '', 0)
    }
  }

  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    setCookie(TERMS_COOKIE_NAME, 'true', 365)
    setShowTermsDialog(false)
  }

  const handleDialogClose = (open: boolean) => {
    setShowTermsDialog(open)
    if (!open && !termsAccepted) {
      // Dialog closed without accepting
      setTermsAccepted(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 antialiased md:grid-cols-2">
      <div className="border-foreground/5 bg-primary/80 text-muted-foreground hidden h-full flex-col justify-between border-r p-10 md:flex">
        <div className="mobile:justify-center flex items-center"></div>

        <footer className="text-sm">
          <blockquote className="space-y-2">
            <footer className="grid grid-cols-1 text-sm">
              <strong className="text-muted">Sistema de Eventos</strong>
            </footer>
          </blockquote>
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center p-6 md:p-0">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-muted-foreground text-sm">
              Logue-se ou registre-se com sua conta Google
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Continue com
              </span>
            </div>
          </div>

          <form action={signInWithGoogle} className="w-full">
            <Button
              variant="outline"
              type="submit"
              className="w-full bg-transparent"
              disabled={!termsAccepted || isPending}
            >
              {isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
          </form>

          <div className="flex gap-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={handleCheckboxChange}
              className="border-primary/50 data-[state=checked]:border-primary border-2"
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <span>
                Aceito os{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowTermsDialog(true)
                  }}
                  className="text-primary font-medium underline underline-offset-4"
                >
                  termos de uso
                </button>
              </span>
            </Label>
          </div>
        </div>

        <TermsDialog
          key={showTermsDialog ? 'terms-open' : 'terms-closed'}
          open={showTermsDialog}
          onOpenChange={handleDialogClose}
          onAccept={handleAcceptTerms}
        />
      </div>
    </div>
  )
}

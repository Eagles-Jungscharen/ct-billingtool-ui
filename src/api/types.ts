// --- Me ---
export interface MeDto {
  userId: string
  displayName: string
  isAdmin: boolean
  groups: string[]
}

// --- Rechnungsprofil ---
export interface RechnungsprofilDto {
  id: string
  name: string
  iban: string
  absenderName: string
  strasse: string
  hausnummer: string
  plz: string
  ort: string
}

export type CreateUpdateRechnungsprofilData = Omit<RechnungsprofilDto, 'id'>

// --- Rechnung ---
export type RechnungStatus = 'entwurf' | 'gesendet' | 'bezahlt'

export interface RechnungspositionDto {
  id: string
  nummer: number
  titel: string
  beschreibung?: string
  einheit: string
  anzahl: number
  preisProEinheit: number
  preisTotal: number
}

export interface RechnungDto {
  id: string
  userId: string
  rechnungsprofilId: string
  rechnungsnummer: string
  titel: string
  beschreibung?: string
  status: RechnungStatus
  rechnungsDatum?: string
  empfaengerName: string
  empfaengerStrasse: string
  empfaengerHausnummer: string
  empfaengerPlz: string
  empfaengerOrt: string
  positionen: RechnungspositionDto[]
  createdAt: string
  updatedAt: string
}

export type CreateUpdateRechnungData = Omit<RechnungDto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

// --- API Errors ---
export interface ApiError {
  status: number
  message: string
}

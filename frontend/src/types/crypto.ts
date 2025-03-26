export interface Cryptocurrency {
  id: number
  image_url: string
  symbol: string
  name: string
  current_price: number | null
}

export interface CryptocurrencyUpdateForm extends Partial<Cryptocurrency> {

}

export interface CryptocurrencyCreateForm extends Omit<
  Cryptocurrency,
  'id' | 'name' | 'current_price' | 'image_url'
> {

}
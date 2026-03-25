import { useState, useEffect, useCallback } from 'react'

const APPSYNC_URL = 'https://nnmz2nlixrbdnb76qd2x3bitxy.appsync-api.us-east-1.amazonaws.com/graphql'
const APPSYNC_KEY = 'da2-4w5jxv4o35b23o44wxy7iulvdm'

async function gql(query, variables = {}) {
  const res = await fetch(APPSYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': APPSYNC_KEY },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

// Queries

const GET_PROFILE   = `query GetUserProfile($userId: ID!) { getUserProfile(userId: $userId) { userId displayName email phoneCountry phoneNumber } }`
const GET_PREFS     = `query GetPreferences($userId: ID!) { getPreferences(userId: $userId) { userId dietType dietRestrictions dietLifestyle sustainabilityOn sustainabilityPriorities } }`
const GET_SETTINGS  = `query GetAppSettings($userId: ID!) { getAppSettings(userId: $userId) { userId notifications sound } }`
const LIST_ADDRESSES = `query ListAddresses($userId: String!) { listAddresses(userId: $userId) { items { id userId label line1 line2 city state zip country isDefault } } }`
const LIST_PAYMENTS  = `query ListPaymentMethods($userId: String!) { listPaymentMethods(userId: $userId) { items { id userId cardType last4 expMonth expYear brand isDefault } } }`
const LIST_ORDERS    = `query ListOrders($userId: String!) { listOrders(userId: $userId) { items { id userId orderNumber date status items subtotal tax shipping total } } }`

// Mutations

const UPSERT_PROFILE  = `mutation UpsertUserProfile($userId: ID!, $displayName: String, $email: String, $phoneCountry: String, $phoneNumber: String) { upsertUserProfile(userId: $userId, displayName: $displayName, email: $email, phoneCountry: $phoneCountry, phoneNumber: $phoneNumber) { userId displayName email phoneCountry phoneNumber } }`
const UPSERT_PREFS    = `mutation UpsertPreferences($userId: ID!, $dietType: String, $dietRestrictions: [String], $dietLifestyle: [String], $sustainabilityOn: Boolean, $sustainabilityPriorities: [String]) { upsertPreferences(userId: $userId, dietType: $dietType, dietRestrictions: $dietRestrictions, dietLifestyle: $dietLifestyle, sustainabilityOn: $sustainabilityOn, sustainabilityPriorities: $sustainabilityPriorities) { userId dietType dietRestrictions dietLifestyle sustainabilityOn sustainabilityPriorities } }`
const UPSERT_SETTINGS = `mutation UpsertAppSettings($userId: ID!, $notifications: Boolean, $sound: Boolean) { upsertAppSettings(userId: $userId, notifications: $notifications, sound: $sound) { userId notifications sound } }`
const CREATE_ADDRESS  = `mutation CreateAddress($id: ID!, $userId: String!, $label: String, $line1: String!, $line2: String, $city: String!, $state: String!, $zip: String!, $country: String, $isDefault: Boolean) { createAddress(id: $id, userId: $userId, label: $label, line1: $line1, line2: $line2, city: $city, state: $state, zip: $zip, country: $country, isDefault: $isDefault) { id userId label line1 line2 city state zip country isDefault } }`
const DELETE_ADDRESS  = `mutation DeleteAddress($id: ID!) { deleteAddress(id: $id) { id } }`
const CREATE_PAYMENT  = `mutation CreatePaymentMethod($id: ID!, $userId: String!, $cardType: String!, $last4: String!, $expMonth: String, $expYear: String, $brand: String, $isDefault: Boolean) { createPaymentMethod(id: $id, userId: $userId, cardType: $cardType, last4: $last4, expMonth: $expMonth, expYear: $expYear, brand: $brand, isDefault: $isDefault) { id userId cardType last4 expMonth expYear brand isDefault } }`
const DELETE_PAYMENT  = `mutation DeletePaymentMethod($id: ID!) { deletePaymentMethod(id: $id) { id } }`
const CREATE_ORDER    = `mutation CreateOrder($id: ID!, $userId: String!, $orderNumber: String!, $date: String!, $status: String!, $items: String!, $subtotal: Float!, $tax: Float!, $shipping: Float!, $total: Float!) { createOrder(id: $id, userId: $userId, orderNumber: $orderNumber, date: $date, status: $status, items: $items, subtotal: $subtotal, tax: $tax, shipping: $shipping, total: $total) { id orderNumber date status total } }`


export function useUserData(authUser) {
  const [profile, setProfile]           = useState(null)
  const [preferences, setPreferences]   = useState(null)
  const [settings, setSettings]         = useState({ notifications: false, sound: false })
  const [addresses, setAddresses]       = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [orders, setOrders]             = useState([])
  const [loading, setLoading]           = useState(true)

  const loadData = useCallback(async () => {
    if (!authUser?.userId) return
    setLoading(true)
    try {
      const uid = authUser.userId
      const [profRes, prefRes, settRes, addrRes, pmRes, ordRes] = await Promise.all([
        gql(GET_PROFILE,    { userId: uid }),
        gql(GET_PREFS,      { userId: uid }),
        gql(GET_SETTINGS,   { userId: uid }),
        gql(LIST_ADDRESSES, { userId: uid }),
        gql(LIST_PAYMENTS,  { userId: uid }),
        gql(LIST_ORDERS,    { userId: uid }),
      ])
      setProfile(profRes.getUserProfile)
      setPreferences(prefRes.getPreferences)
      if (settRes.getAppSettings) setSettings(settRes.getAppSettings)
      setAddresses(addrRes.listAddresses?.items || [])
      setPaymentMethods(pmRes.listPaymentMethods?.items || [])
      setOrders(ordRes.listOrders?.items || [])
    } catch (err) {
      console.error('Failed to load user data:', err)
    } finally {
      setLoading(false)
    }
  }, [authUser])

  // Auto-create default profile on first login
  useEffect(() => {
    if (!authUser?.userId || loading) return
    if (!profile) {
      gql(UPSERT_PROFILE, { userId: authUser.userId, displayName: authUser.displayName || authUser.email.split('@')[0], email: authUser.email })
        .then(r => setProfile(r.upsertUserProfile)).catch(console.error)
    }
    if (!settings?.userId) {
      gql(UPSERT_SETTINGS, { userId: authUser.userId, notifications: false, sound: false })
        .then(r => setSettings(r.upsertAppSettings)).catch(console.error)
    }
  }, [authUser, loading, profile, settings])

  useEffect(() => { loadData() }, [loadData])

  // Mutation helpers

  const saveProfile = async (updates) => {
    const res = await gql(UPSERT_PROFILE, { userId: authUser.userId, ...updates })
    setProfile(res.upsertUserProfile)
  }

  const savePreferences = async (updates) => {
    const res = await gql(UPSERT_PREFS, { userId: authUser.userId, ...updates })
    setPreferences(res.upsertPreferences)
  }

  const saveSettings = async (updates) => {
    const res = await gql(UPSERT_SETTINGS, { userId: authUser.userId, ...updates })
    setSettings(res.upsertAppSettings)
  }

  const addAddress = async (addr) => {
    const id = crypto.randomUUID()
    const res = await gql(CREATE_ADDRESS, { id, userId: authUser.userId, ...addr })
    setAddresses(prev => [...prev, res.createAddress])
    return res.createAddress
  }

  const removeAddress = async (id) => {
    await gql(DELETE_ADDRESS, { id })
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const addPaymentMethod = async (pm) => {
    const id = crypto.randomUUID()
    const res = await gql(CREATE_PAYMENT, { id, userId: authUser.userId, ...pm })
    setPaymentMethods(prev => [...prev, res.createPaymentMethod])
    return res.createPaymentMethod
  }

  const removePaymentMethod = async (id) => {
    await gql(DELETE_PAYMENT, { id })
    setPaymentMethods(prev => prev.filter(p => p.id !== id))
  }

  const saveOrder = async (order) => {
    const id = crypto.randomUUID()
    const res = await gql(CREATE_ORDER, { id, userId: authUser.userId, items: JSON.stringify(order.items), ...order })
    setOrders(prev => [res.createOrder, ...prev])
    return res.createOrder
  }

  return {
    profile, preferences, settings, addresses, paymentMethods, orders, loading,
    saveProfile, savePreferences, saveSettings,
    addAddress, removeAddress,
    addPaymentMethod, removePaymentMethod,
    saveOrder,
  }
}

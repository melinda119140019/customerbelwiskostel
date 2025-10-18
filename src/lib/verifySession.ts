import { baseURL } from '@/utils/Uri'
import { NextRequest } from 'next/server'

export async function verifySession(req: NextRequest): Promise<boolean> {
  try {
    const cookie = req.headers.get('cookie') || ''

    const res = await fetch(`${baseURL}/auth/token`, {
      method: 'GET',
      headers: {
        cookie,
      },
      credentials: 'include',
    })

    const data = await res.json()
    return !!data.data.accessToken
  } catch (err) {
    return false
  }
}

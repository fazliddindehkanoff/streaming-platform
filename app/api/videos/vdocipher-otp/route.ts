// Create a Next.js API route: /app/api/video/[videoId]/route.ts

import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const videoId = params.videoId
  
  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
  }

  try {
    // Get API secret from environment variable
    const apiSecret = process.env.NEXT_PUBLIC_VDOCIPHER_API_SECRET
    
    if (!apiSecret) {
      return NextResponse.json(
        { error: 'VDOCipher API secret not configured' }, 
        { status: 500 }
      )
    }

    // Make the request from the server side
    const response = await fetch(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Apisecret ${apiSecret}`
      },
      body: JSON.stringify({
        ttl: 300 // OTP valid for 5 minutes
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `VDOCipher API error: ${response.status} ${response.statusText}`, details: errorText }, 
        { status: response.status }
      )
    }

    // Return the OTP data from VDOCipher
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting VDOCipher OTP:', error)
    return NextResponse.json(
      { error: 'Failed to get video OTP' }, 
      { status: 500 }
    )
  }
}
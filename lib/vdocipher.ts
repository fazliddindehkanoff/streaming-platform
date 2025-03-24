/**
 * VDOCipher utility functions
 */

// Function to get OTP for VDOCipher video
export async function getVdoCipherOtp(videoId: string) {
  try {
    // Call our own API endpoint instead of VDOCipher directly
    const response = await fetch(`/api/video/${videoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response 
  } catch (error) {
    console.error("Error getting VDOCipher OTP:", error)
    throw error
  }
}

// Function to extract video ID from VDOCipher URL or direct ID
export function extractVdoCipherId(url: string): string | null {
  // If it's already just an ID (no slashes or query params)
  if (/^[a-zA-Z0-9]+$/.test(url)) {
    return url
  }

  // Try to extract from URL
  try {
    // For URLs like https://player.vdocipher.com/v2/?otp=xxx&playbackInfo=xxx
    const playbackInfoMatch = url.match(/playbackInfo=([^&]+)/)
    if (playbackInfoMatch) {
      const playbackInfo = JSON.parse(decodeURIComponent(playbackInfoMatch[1]))
      if (playbackInfo.videoId) {
        return playbackInfo.videoId
      }
    }

    // For direct video URLs like https://dev.vdocipher.com/api/videos/abcdef123456
    const directMatch = url.match(/\/videos\/([a-zA-Z0-9]+)/)
    if (directMatch) {
      return directMatch[1]
    }

    return null
  } catch (error) {
    console.error("Error extracting VDOCipher ID:", error)
    return null
  }
}
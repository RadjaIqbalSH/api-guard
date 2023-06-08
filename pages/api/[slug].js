import rateLimiter from "../../limiter"
import CryptoJS from 'crypto-js'
import _isEmpty from "lodash/isEmpty"

const enkripsi = (message) => {
  const replaceUrl = message.replace(/\"/g, '/');
  const decrypted = CryptoJS.AES.decrypt(replaceUrl, "radjaiqbalsanusiharahap", { mode: CryptoJS.mode.CBC });
  return decrypted.toString(CryptoJS.enc.Utf8)
}

const limiter = rateLimiter({
  interval: 60 * 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export default async function handler(req, res) {
  let url = ""

  const { slug, ...restQuerys } = req.query
  
  // Dekripsi
  const plaintext = enkripsi(slug)
  
  if(_isEmpty(restQuerys)) {
  
    url = plaintext
  
  } else {
  
    const params = new URLSearchParams(restQuerys)
    url = `${plaintext}?${params}`
  
  }

  console.log("URL => ", url)

  try {
    await limiter.check(res, 10, slug)
    const response = await fetch(url)
    res.status(200).json(await response.json())
  } catch (error) {
    res.status(500).json({ name: 'ERROR JHON' })
  }
}

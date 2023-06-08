import { useState } from 'react'
import CryptoJS from 'crypto-js'

const enkripsi = (message) => {
  const encrypted = CryptoJS.AES.encrypt(message, "radjaiqbalsanusiharahap", { mode: CryptoJS.mode.CBC });
  const newString = encrypted.toString()
  return newString.replace(/\//g, '"');
}

const defaultResponse = () => ({
  satu: "waitting for response", 
  dua: "waitting for response", 
  tiga: "waitting for response", 
  empat: "waitting for response", 
})

export const getServerSideProps = async () => {
  const urls = [
    "https://pokeapi.co/api/v2/pokemon/ditto",
    "https://pokeapi.co/api/v2/pokemon-species/aegislash",
    "https://pokeapi.co/api/v2/type/3",
    "https://pokeapi.co/api/v2/pokemon"
  ]

  const encryptUrls = urls.map(item => {
    return enkripsi(item)
  })

  return { props: {
    urls: encryptUrls
  } };
};

export default function Index(props) {
  const [response, setResponse] = useState(defaultResponse())

  const makeRequest = async (url, type) => {
    const res = await fetch(`/api/${url}`)
    if(res.headers.get('X-RateLimit-Remaining') === "1") {
      window.location.reload()
    }
    setResponse((current) => ({
      ...current,
      [type] : {
        status: res.status,
        limit: res.headers.get('X-RateLimit-Limit'),
        remaining: res.headers.get('X-RateLimit-Remaining'),
      }
    }))
  }

  return (
    <main className="">
      <div>
        <button onClick={() => makeRequest(props.urls[0], "satu")}>Make Request</button>
        {response.satu && (
          <code className="">
            <pre>{JSON.stringify(response.satu)}</pre>
          </code>
        )}
      </div>
      <div>
        <button onClick={() => makeRequest(props.urls[1], "dua")}>Make Request</button>
        {response.dua && (
          <code className="">
            <pre>{JSON.stringify(response.dua)}</pre>
          </code>
        )}
      </div>
      <div>
        <button onClick={() => makeRequest(props.urls[2], "tiga")}>Make Request</button>
        {response.tiga && (
          <code className="">
            <pre>{JSON.stringify(response.tiga)}</pre>
          </code>
        )}
      </div>
      <div>
        <button onClick={() => makeRequest(`${props.urls[3]}?limit=100000&offset=0`, "empat")}>Make Request</button>
        {response.empat && (
          <code className="">
            <pre>{JSON.stringify(response.empat)}</pre>
          </code>
        )}
      </div>
    </main>
  )
}

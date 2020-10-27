import 'isomorphic-fetch'

const WEB_SERVER_URL = location.origin
const RUNTIME_CONFIG_URL = `${WEB_SERVER_URL}${process.env.BASE_URL}config/runtime.json`
let cachedConfig = null

export default function getRuntimeConfig () {
  if (cachedConfig) return cachedConfig

  return fetch(RUNTIME_CONFIG_URL)
    .then(res => res.json())
    .then(config => {
      cachedConfig = config;
      return cachedConfig;
    })
}
import axios from 'axios'
import getRuntimeConfig from "../plugins/runtimeConfig";

let configPromise = getRuntimeConfig();
let client = null;
export default {
  async execute(method, resource, data) {
    if (!client){
      let config = await configPromise;
      client = axios.create({
        baseURL: config.WebApiUrl,
        json: true});
    }
    const token = localStorage.getItem('adal.idtoken');

    return client({
      method,
      url: resource,
      data,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    }).then(req => {
      return req.data
    })
  },
  get(resource, data) {
    return this.execute('get', resource, data)
  },
  post(resource, data) {
    return this.execute('post', resource, data)
  },
  put(resource, data) {
    return this.execute('put', resource, data)
  },
  delete(resource, data) {
    return this.execute('delete', resource, data)
  }
}
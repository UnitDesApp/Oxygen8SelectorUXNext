import axios, { AxiosInstance } from 'axios';
import { BACKEND_ENDPOINT } from 'src/config-global';

export default abstract class BaseApi {
  client: AxiosInstance;

  constructor() {
    const client = axios.create({
      baseURL: BACKEND_ENDPOINT,
    });

    this.client = client;
  }
}

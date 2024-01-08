import { AxiosResponse } from 'axios';
import AbstractApi from './AbstractApi';

export default class UserApi extends AbstractApi {
  constructor() {
    super();
  }

  login = async (params: { email: string; password: string }): Promise<AxiosResponse> => {
    return this.client.post(`/api/auth/Login`, params);
  };
}

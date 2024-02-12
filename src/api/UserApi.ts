import { AxiosResponse } from 'axios';
import AbstractApi from './AbstractApi';

export default class UserApi extends AbstractApi {
  login = async (params: { email: string; password: string }): Promise<AxiosResponse> =>
    this.client.post(`/api/auth/Login`, params);
}

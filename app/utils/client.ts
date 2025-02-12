import config from '@/config.json';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class Client {
  public url: string;

  constructor(url: string = config.url, mode: string = 'http') {
    if (!url.startsWith(`${mode}://`)) {
      url = `${mode}://${url}`;
    }
    this.url = url;
  }

  public async call(
    fn: string = 'info',
    params: Record<string, unknown> = {},
    headers: Record<string, string> = {}
  ): Promise<unknown> {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
      time: new Date().getTime().toString(),
    };

    try {
      return await this.async_forward(fn, params, headers);
    } catch (error) {
      console.error('Request failed:', error);
      return null; // Return null if the request fails
    }
  }

  private async async_forward(
    fn: string,
    params: Record<string, unknown> | FormData,
    headers: Record<string, string>
  ): Promise<unknown> {
    let requestHeaders: Record<string, string> = {};
    let data: string | FormData;

    if (params instanceof FormData) {
      data = params;
    } else {
      data = JSON.stringify(params);
      requestHeaders['Content-Type'] = 'application/json';
    }

    requestHeaders = { ...requestHeaders, ...headers };
    const url: string = `${this.url}/${fn}`;

    const config: AxiosRequestConfig = {
      method: 'post',
      url: url,
      headers: requestHeaders,
      data: data,
    };

    try {
      const response = await axios(config);
      const contentType = response.headers['content-type'];

      if (contentType?.includes('text/event-stream')) {
        return this.handleStream(response);
      }

      if (contentType?.includes('application/json')) {
        return response.data;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Request failed:', error.message);
      } else {
        console.log('Unexpected error:', error);
      }
      return null;
    }
  }

  private async handleStream(response: AxiosResponse): Promise<void> {
    const reader = (response.data as ReadableStream).getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      console.log(chunk);
    }
  }
}

export default Client;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '@/config.json';

type Params = Record<string, unknown> | FormData;

type RequestData = {
  params: Params;
  headers: Record<string, string>;
};

export class Client {
  public url: string;
  public key?: any;

  constructor(
    key?: any,
  ) {
    this.key = key;
    this.url = config.url
  }

  public async call(
    fn: string = 'info',
    params: Params = {},
    module?: string,
    network: string = 'local',
    key?: any,
    timeout: number = 40,
    extraHeaders: Record<string, string> = {}
  ): Promise<unknown> {
    return new Client(module || fn, key, network).forward(
      fn,
      params,
      timeout,
      extraHeaders
    );
  }

  private getRequest(params: Params): RequestData {
    const timeStr = (Date.now() / 1000).toFixed(7);
    const headers: Record<string, string> = {
      'key': "5CJhiA6fEJWV8DtyqbnV4MVpWMW1dHMoMm2eRZMw164mFuRw",
      'crypto_type': "sr25519",
      'time': timeStr,
      'signature': Buffer.from(JSON.stringify({'params': params, 'time': timeStr})).toString('hex'),
      'Content-Type': params instanceof FormData ? 'multipart/form-data' : 'application/json',
    };

    return { params, headers };
  }

  public async forward(
    fn: string = 'info',
    params: Params = {},
    timeout: number = 40,
    extraHeaders: Record<string, string> = {}
  ): Promise<unknown> {
    const url = `${this.url}/${fn}`;
    const request = this.getRequest(params);
    const config: AxiosRequestConfig = {
      method: 'post',
      url,
      headers: { ...request.headers, ...extraHeaders },
      data: request.params,
      timeout: timeout * 1000,
    };

    try {
      const response = await axios(config);
      return this.processResponse(response);
    } catch (error) {
      console.error('Request failed:', error);
      return null;
    }
  }

  private processResponse(response: AxiosResponse): unknown {
    const contentType = response.headers['content-type'];

    if (contentType?.includes('application/json')) {
      return response.data;
    }

    if (contentType?.includes('text/event-stream')) {
      return this.handleStream(response);
    }

    return response.data;
  }

  private async handleStream(response: AxiosResponse): Promise<void> {
    const reader = response.data?.getReader?.();
    if (!reader) {
      console.error('Streaming not supported in this environment');
      return;
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      console.log(decoder.decode(value));
    }
  }
}

export default Client;

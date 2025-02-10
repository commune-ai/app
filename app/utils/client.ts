"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/config.json';
export class Client {
  public url: string;

  constructor(url: string = config.url , mode: string = 'http') {
    if (!url.startsWith(`${mode}://`)) {
      url = `${mode}://${url}`;
    }
    this.url = url;
  }

  public async call(
    fn: string = 'info',
    params: Record<string, any> = {},
    headers: Record<string, string> = {}
  ): Promise<any> {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
      time: new Date().getTime().toString(),
    };
    try {
      const data = await this.async_forward(fn, params, headers);
      return data;
    } catch (error) {
      console.error('Error in call method:', error);
      throw error;
    }
  }


  private async async_forward(
      fn: string = 'info',
      params: Record<string, any> | FormData = {},
      headers: Record<string, string> = {}
    ): Promise<any> {
      let requestHeaders: Record<string, string> = {};
      let body: string | FormData;
    
      if (params instanceof FormData) {
        body = params;
        // Don't set Content-Type for FormData, browser will set it with boundary
      } else {
        body = JSON.stringify(params);
        requestHeaders['Content-Type'] = 'application/json';
      }
    
      requestHeaders = { ...requestHeaders, ...headers };
    
      const url: string = `${this.url}/${fn}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: requestHeaders,
          body: body,
        });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('text/event-stream')) {
        return this.handleStream(response);
      }

      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error('Request failed:', error);
      return { error: (error as Error).message };
    }
  }

  private async handleStream(response: Response): Promise<void> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      console.log(chunk); // Handle streaming data as needed
    }
  }
}

export default Client;

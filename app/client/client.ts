import axios, { AxiosResponse } from 'axios';

export class Client {
  private url: string;

  constructor(url: string = 'http://localhost:8000', mode: string = 'http') {
    this.url = url;
    if (!this.url.startsWith(`${mode}://`)) {
      this.url = `${mode}://${this.url}`;
    }

  }

  /**
   * Forward a request to the specified function
   */
  async call<T = any>(
    fn: string = 'info',
    params: Record<string, any>  = {},
    timeout: number = 6
  ): Promise<T> {

    let headers = this.getHeaders();

    try {
      const response = await axios.post<T>(
        `${this.url}/${fn}/`, 
        params, 
        { 
          timeout: timeout * 1000,
          responseType: 'json'
        }
    
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Server error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Client/1.0'
      // Add any other headers you need here
    };
  }

}
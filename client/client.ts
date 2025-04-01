import axios, { AxiosResponse } from 'axios';

interface Params {
  args?: any[];
  kwargs?: Record<string, any>;
}

export class Client {
  private url: string;

  constructor(url: string = 'http://localhost:8000') {
    this.url = url;
  }

  /**
   * Forward a request to the specified function
   */
  async forward<T = any>(
    fn: string = 'info',
    params: any[] | Record<string, any> | null = null,
    args: any[] = [],
    kwargs: Record<string, any> = {},
    timeout: number = 2
  ): Promise<T> {
    const resolvedParams = this.getParams(params, args, kwargs);

    headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };


    
    try {
      const response = await axios.post<T>(
        `${this.url}/${fn}/`, 
        resolvedParams, 
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

  /**
   * Normalize parameters for the API call
   */
  private getParams(
    params: any[] | Record<string, any> | null = null,
    args: any[] = [],
    kwargs: Record<string, any> = {}
  ): Params {
    // If params is already in the correct format, return it
    if (params && typeof params === 'object' && 'args' in params && 'kwargs' in params) {
      return params as Params;
    }

    const resolvedParams: Params = { args: [], kwargs: {} };
    
    // Ensure args and kwargs are properly initialized
    args = Array.isArray(args) ? args : [];
    kwargs = kwargs && typeof kwargs === 'object' ? kwargs : {};
    
    // Handle params based on type
    if (params) {
      if (Array.isArray(params)) {
        args = params;
      } else if (typeof params === 'object') {
        Object.assign(kwargs, params);
      } else {
        throw new Error(`Invalid params: ${JSON.stringify(params)}`);
      }
    }

    resolvedParams.args = args;
    resolvedParams.kwargs = kwargs;
    
    return resolvedParams;
  }
}
import qs from 'qs';

type GetOptions = {
    params?: any,
    headers?: any
}

type PostOptions = {
  params?: any,
  body? :any,
  headers?: any
}
class FetchInstance {
    private baseUrl: string | null = null;

    constructor(rootUrl: string) {
        if (rootUrl.endsWith('/')) rootUrl = rootUrl.substring(0, rootUrl.length - 1);
        this.baseUrl = rootUrl;
    }

    private mergeHeaders(headers: any, prevHeaders?: any): any {

        if (prevHeaders) {
            return {
                ...prevHeaders,
                ...headers
            }
        }

        return headers;
    }

    public async get(url: string, options?: GetOptions): Promise<any> {
      let getParams = '';
      if (options?.params) getParams = `?${new URLSearchParams(options.params)}`;

      return await fetch(`${this.baseUrl}${url}${getParams}`, {
          method: 'GET',
          headers: options?.headers ?? {}
      });
    }

    public async getJson(url: string, options?: GetOptions): Promise<any> {

        let internalHeaders = {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        };

        if (!options) options = { headers: internalHeaders};
        else options.headers = this.mergeHeaders(internalHeaders, options.headers);

        const response = await this.get(url, options);
        return await response.json();
    }

    public async getXml(url: string, options?: GetOptions): Promise<any> {

        let internalHeaders = {
          'Accept': 'application/xml',
          'Content-type': 'application/xml',
        };

        if (!options) options = { headers: internalHeaders};
        else options.headers = this.mergeHeaders(internalHeaders, options.headers);

        const response = await this.get(url, options);
        return await response.text();
    }

    public async post(url: string, options?: PostOptions): Promise<any> {
        let getParams = '';
        if (options?.params) getParams = `?${new URLSearchParams(options.params)}`;

        return await fetch(`${this.baseUrl}${url}${getParams}`, {
          method: 'POST',
          headers: options?.headers ?? {},
          body: JSON.stringify(options?.body ?? {})
        });
    }

    public async postJson(url: string, options?: PostOptions): Promise<any> {
        let internalHeaders = {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        };

        if (!options) options = { headers: internalHeaders};
        else options.headers = this.mergeHeaders(internalHeaders, options.headers);

        const response = await this.post(url, options);
        return await response.json();
    }

    public static async fetchWithTimeout(url: string, options: any): Promise<any> {
      const { timeout = 8000 } = options;
  
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
    
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
    
      return response;
    };

    public static formatUrl (url: string, args: any): string {
        const params = qs.stringify(args);
        if (params && params !== '') return `${url}?${params}`;
        return url;
    };
}

export default FetchInstance;
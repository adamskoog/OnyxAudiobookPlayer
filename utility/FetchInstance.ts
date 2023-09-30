class FetchInstance {
    private baseUrl: string | null = null;

    constructor(rootUrl: string) {
        //TODO: string ending /
        this.baseUrl = rootUrl;
    }

    public async get(url: string, params: any = null, headers: any = {}): Promise<any> {
      let getParams = '';
      if (params) getParams = `?${new URLSearchParams(params)}`;
        const response = await fetch(`${this.baseUrl}${url}${getParams}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json',
                ...headers
            }
        });

        return await response.json();
    }

    public async getXml(url: string, params: any = null, headers: any = {}): Promise<any> {
        const getParams = new URLSearchParams(params);
        const response = await fetch(`${this.baseUrl}${url}?${getParams}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/xml',
                'Content-type': 'application/xml',
                ...headers
            }
          });

        return await response.text();
    }

    public async post(url: string, data: any, params: any, headers: any = {}): Promise<any> {
        let getParams = '';
        if (params) getParams = `?${new URLSearchParams(params)}`;

        const response = await fetch(`${this.baseUrl}${url}${getParams}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
              ...headers
          },
          body: JSON.stringify(data ?? {})
        });

        return await response.json();
    }
}

export default FetchInstance;
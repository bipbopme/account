export default class ZimbraAdmin {
  url: string;
  authToken: string | undefined;

  constructor(url: string) {
    this.url = url;
  }

  async auth(username: string, password: string): Promise<void> {
    if (!this.authToken) {
      const response = await this.post({
        AuthRequest: {
          _jsns: "urn:zimbraAdmin",
          account: {
            by: "name",
            _content: username,
          },
          password: password,
        },
      });

      this.authToken = response?.Body?.AuthResponse?.authToken[0]?._content;
    }
  }

  async createAccount(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    displayName: string
  ) {
    try {
      const response = await this.post({
        CreateAccountRequest: {
          _jsns: "urn:zimbraAdmin",
          name: email,
          password: password,
          a: [
            { n: "givenName", _content: firstName },
            { n: "sn", _content: lastName },
            { n: "displayName", _content: displayName },
          ],
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  private async post(body: {}, authenticated = true) {
    const header = this.getHeader(authenticated);
    const requestBody = { ...header, Body: body };

    const response = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      const fault = json?.Body?.Fault;

      if (fault) {
        throw new Error(fault.Detail?.Error?.Code);
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    }
  }

  private getHeader(authenticated = true) {
    return {
      Header: {
        context: {
          _jsns: "urn:zimbra",
          authToken: authenticated ? this.authToken : undefined,
        },
      },
    };
  }
}

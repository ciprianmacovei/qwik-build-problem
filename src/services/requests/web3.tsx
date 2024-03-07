export class Web3ServerServiceReq {
  private static url: string = "http://backend:8000/api/web3";

  static async getPriceDiscovery(
    token: string,
    cryptoSymbol: string,
    price: string
  ) {
    const res = await fetch(this.url + "/price", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crypto_symbol: cryptoSymbol,
        price,
      }),
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("getPriceDiscovery request failed");
    }
  }

  static async watchTransactionTake(
    token: string,
    hash: string,
    walletFrom: string,
    walletTo: string,
    wishId: number
  ) {
    const res = await fetch(this.url + "/watch/take", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hash,
        wallet_from: walletFrom,
        wallet_to: walletTo,
        wish_id: wishId,
      }),
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async watchTransactionContribute(
    token: string,
    hash: string,
    walletFrom: string,
    walletTo: string,
    wishId: number,
    contribution: number
  ) {
    const res = await fetch(this.url + "/watch/contribute", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hash,
        wallet_from: walletFrom,
        wallet_to: walletTo,
        wish_id: wishId,
        contribution,
      }),
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }
}

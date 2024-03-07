export class TwitterServiceReq {
    private static url: string = "http://backend:8000/api/auth";
  
    static async getTwitterAuthUrl(
    ) {
      const res = await fetch(this.url + "/get-twitter-auth-url", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (res.ok) {
        const resData = await res.json();
        return resData;
      } else {
        throw new Error("getTwitterAuthUrl request failed");
      }
    }
  
   
  }
  
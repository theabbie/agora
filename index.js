var axios = require("axios");

module.exports = class Agora {
  constructor() {}

  async login(username,password) {
    this.username = username;
    this.password = password;
    var token = await axios({
      url: 'https://apiprod.agoraimages.com/users.v2/auth/login',
      method: 'POST',
      data: {
	"email":"abhishek7gg7@gmail.com",
	"password":"SNh6KpBJtxgA6ns"
      }
    });
    this.token = token.data.accessToken;
    this.rft = token.data.refreshToken;
    this.uid = token.data.userId;
    this.token = token.data.userId;
  }

  async getProfile() {
    var profile = await axios({
       url: 'https://apiprod.agoraimages.com/users.v2/user/profile',
       headers: {
         authorization: 'Bearer ' + this.token;
       }
     });
    return profile.data;
  }
  
  async addToken(token) {
    this.token = token;
    var uid = await this.getProfile();
    this.uid = uid.userId;
  }
}

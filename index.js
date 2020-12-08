var axios = require("axios");
var fs = require("fs");

module.exports = class Agora {
  constructor() {}

  async login(username,password) {
    this.username = username;
    this.password = password;
    var token = await axios({
      url: 'https://apiprod.agoraimages.com/users.v2/auth/login',
      method: 'POST',
      data: {
	"email": this.username,
	"password": this.password
      }
    });
    this.token = token.data.accessToken;
    this.rft = token.data.refreshToken;
    this.uid = token.data.userId;
    return this.token;
  }

  async getProfile() {
    var profile = await axios({
       url: 'https://apiprod.agoraimages.com/users.v2/user/profile',
       headers: {
         authorization: 'Bearer ' + this.token
       }
     });
    return profile.data;
  }
  
  async addToken(token) {
    this.token = token;
    var uid = await this.getProfile();
    this.uid = uid.userId;
  }

  async upload(path,title) {
    var up_url = await axios({
      url: 'https://apiprod.agoraimages.com/media.v1/medias/upload',
      method: 'POST',
      data: {
	"authorId": this.uid,
	"locationDescription":"",
	"metaData": {
	  "device":"Xiaomi Redmi Note 7 Pro",
	  "height":4000,
	  "width":3000
	},
	"platform":"ANDROID",
	"title": title || "Image",
	"userTags":""
      },
      headers: {
        authorization: 'Bearer ' + this.token
      }
    });
    var file = fs.createReadStream(path);
    var result = await axios({
      url: up_url.data.signedUrl,
      method: 'PUT',
      data: file,
      headers: {
        'Content-Type': 'image/*'
      }
    });
    return result.data;
  }
}

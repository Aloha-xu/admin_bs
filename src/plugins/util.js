export function getToken() {
  var token = document.cookie;
  var cookies = token.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].split("=");
    if (cookie[0].trim() == "token") {
      var TOKEN = cookie[1];
    }
  }
  return TOKEN;
}

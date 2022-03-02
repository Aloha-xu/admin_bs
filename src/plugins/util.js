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

export function getYMDHMS(timestamp) {
  let time = new Date(timestamp);
  let year = time.getFullYear();
  const month = (time.getMonth() + 1).toString().padStart(2, "0");
  const date = time
    .getDate()
    .toString()
    .padStart(2, "0");
  const hours = time
    .getHours()
    .toString()
    .padStart(2, "0");
  const minute = time
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const second = time
    .getSeconds()
    .toString()
    .padStart(2, "0");

  return (
    year + "-" + month + "-" + date + "-" + hours + ":" + minute + ":" + second
  );
}

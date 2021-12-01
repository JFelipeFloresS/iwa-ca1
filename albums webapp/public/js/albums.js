//document.cookies = "logged in";

let cookies = document.cookies;

if (cookies.match("logged in")) {
  alert("This " + cookies);
  window.location.replace("https://www.rollingstone.com");
}

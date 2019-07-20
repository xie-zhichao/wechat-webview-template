import cookie from 'react-cookies';

const tranParams = function (params) {
  if (params.condition) {
    return JSON.stringify({ ...params, condition: { ...params.condition } })
  } else {
    return JSON.stringify({ ...params })
  }
}

export const POST = (host, url, params = {}, appName = "supe") => new Promise(resolve => {
  fetch(host + url, {
    credentials: "include",
    method: "POST",
    body: tranParams(params),
    headers: {
      "Content-Type": "application/json",
      'Authorization': localStorage.getItem('userIdNew')  //e8008483201907101807419//  localStorage.getItem('userId')
    }
  })
    .then(e => e.json())
    .then(e => {
      resolve(e);
    })
    .catch(e => {
      resolve(e);
    });
  }
);


export const GET = (host, url, params = {}, appName = "supe") => new Promise(resolve => {
  fetch(host + url, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${cookie.load(
        "tokenType"
      )} ${cookie.load("token")}`,
      "X-Application-name": 'supe'
    }
  })
    .then(e => e.json())
    .then(e => {
      resolve(e);
    })
    .catch(e => {
      resolve(e);
    });
}
);
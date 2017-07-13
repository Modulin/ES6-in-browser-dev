self.addEventListener('fetch', function(event) {
  event.respondWith(
    Promise.resolve().then(()=>{
      let url = event.request.url.replace(location.origin, '').replace(/^\//, '');

      if(url.split('?')[0] === '' || url.indexOf('src/') === -1) {
        return fetch(event.request);
      }

      url = resolveUrl(url);
      url = `${location.origin}/${url}`;

      const request = copyRequest(event.request, {url});
      return fetch(request).then(rewrite);
    })
  );
});

function rewrite(response) {
  const matched = response.url.match(/\.(\w+)(\?|$)/);
  if(!matched) {
    return response;
  }

  const type = matched[1];
  if(type === 'html' || type === 'css') {
    return response.text().then((text)=>{
      const wrappedText = `export default \`${text}\``;
      return copyResponse(response, {
        body: wrappedText,
        headers:{
          "content-type": "application/javascript"
        }});
    });
  }

  return response;
}

const roots = {
  jquery: 'node_modules/jquery/dist/jquery.js'
};

function resolveUrl(url) {
  const prefix = url.split('/');
  const root = roots[prefix[0]];
  
  if(root) {
    prefix.splice(0, 1, root);
  }

  return prefix.join('/');
}

function copyResponse(response, {body, headers={}}) {
  const defaultHeaders = {};
  response.headers.forEach((v,k)=>defaultHeaders[k] = v);
  Object.entries(headers).forEach(([k, v])=>defaultHeaders[k] = v);

  return new Response(body, {
    headers: defaultHeaders,
    status: response.status,
    statusText: response.statusText
  });
}

function copyRequest(request, {url}) {
  return new Request(url, {
    method: 'GET',
    headers: request.headers,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer,
    integrity: request.integrity
  });
}
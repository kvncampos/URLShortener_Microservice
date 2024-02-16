const dns = require('dns');

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
  }
  
function http_checker(url) {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    const t = url;
    
    if (t.match(regex)) {
        console.log("REGEX MATCH")
        return true
    } else {
        console.log("REGEX DOES NOT MATCH")
        return false
    }
}

function dnsLookup(urlCheck) {
    // http_checker(urlCheck)

    // console.log(checked)
    try {
        let url = new URL(urlCheck);
        dns.lookup(url.hostname, (err, address, family) => {
            if (err) {
                console.error('URL ERROR: Invalid URL:', err.code);
                // res.json({ status: "invalid" });
                return false
            } else {
                console.log('SUCCESS: Valid URL');
                // res.json({ status: "valid" });
                return true
            }
        });
      } catch (err) {
          console.error("URL ERROR: Invalid URL:", err.code);
        //   res.json({ status: "invalid" });
          return false
      }
}

module.exports = dnsLookup;

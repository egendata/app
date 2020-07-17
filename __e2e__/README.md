Phone app e2e lib
-----------------

```javascript
const phone = require(`${phone_e2e_dist_dir}/`)

phone.Config.OPERATOR_URL = 'http://localhost:3000/api'
await phone.createAccount()
```


## React native modules in e2e-tests

To simplify and speed up some javascript implementations of react native functions including cryptographic JOSE functions, some modules are replaced in the test scenario, with code from the /src directory, using webpack. Similar to how the JOSE functions are also replaced for platform specific code when building for IOS and Android. 
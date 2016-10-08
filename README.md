```javascript
var yau = require('yuan-auto-update');

var ret = yau('yuan', {
	// Specify the registry of npm.
	registry: 'https://registry.npmjs.org/',

	// Whether to install the module globally.
	global: false,

	// Specify the install path, only available when *global* not true.
	path: '/path/to/my/node_modules/'
});

if (ret == 'error') {
	// Failed to detect or update.
}
if (ret == 'lastest') {
	// Success to detect and the lastest version had been installed.
}
if (ret == 'updated') {
	// Success to detect and update.
}
```

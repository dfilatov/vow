test:
	node test-runner.js

benchmark:
	node benchmarks/comparison.js

min:
	node ./node_modules/uglify-js/bin/uglifyjs lib/jspromise.js > jspromise.min.js

.PHONY: test benchmark min
test:
	node test-runner.js

benchmark:
	node benchmarks/comparison.js

min:
	./node_modules/uglify-js/bin/uglifyjs lib/vow.js > vow.min.js

.PHONY: test benchmark min
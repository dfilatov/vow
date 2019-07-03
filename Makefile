test:
	node test/utils/runner.js

benchmark:
	node benchmarks/comparison.js

min:
	./node_modules/.bin/terser --compress --mangle -- lib/vow.js > vow.min.js

.PHONY: test benchmark min

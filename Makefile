
MOCHA          ?= node_modules/.bin/mocha
MOCHA_REPORTER ?= spec
JSCOVERAGE     ?= jscoverage
SRC             = index.js
SRC            += $(wildcard lib/*.js)
TESTS           = $(wildcard test/*.js)
ACCEPTANCE      = $(wildcard test/acceptance/*.js)

test: node_modules
	@$(MOCHA) --reporter $(MOCHA_REPORTER)

test-acceptance: node_modules $(ACCEPTANCE)

$(ACCEPTANCE):
	node $@

coverage.html: node_modules lib-cov $(TESTS)
	BUNYAN_ENV_COV=1 \
		MOCHA_REPORTER=html-cov \
		$(MAKE) test > coverage.html
	open coverage.html

lib-cov: $(SRC)
	rm -rf lib-cov
	$(JSCOVERAGE) lib lib-cov

node_modules:
	@npm install

clean:
	rm -rf lib-cov node_modules *.log

travis: test test-acceptance

.PHONY: test test-acceptance $(ACCEPTANCE) clean

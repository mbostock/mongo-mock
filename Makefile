test: \
	test/test-collection.test \
	test/test-cursor.test \
	test/test-db.test \
	test/test-server.test

%.test: %.js %.out
	@/bin/echo -n "test: $* "
	@node $< > $*.actual
	@diff -U 3 $*.out $*.actual && rm -f $*.actual \
		&& echo '\033[1;32mPASS\033[0m' \
		|| echo test: $* '\033[1;31mFAIL\033[0m'

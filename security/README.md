Ezbake Security Client
--------------------------

## Dependencies
Ezbake Dependencies:

* ezbake-configuration
* ezbake-thriftutils

## Running tests
Tests have been broken out into subfolders:

1. test/unit
2. test/integration

The integration tests are not fully independent. First dependency - zookeeper running on localhost:2181.

In either event, run tests with **mocha**

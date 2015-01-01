trace-hooks
===========

rewrite JS code to add instrumentation hooks.

Currently it tracks
-------------------

* function calls
* branch paths

data
---------

* position in original source
* counts

Plans to support
----------------

* type information of method call arguments
* type information of branch points
* type information of various vars

Vizualizing
------------

basic UI is in the works, but nothing to show yet.

Tooling
-------

sorta done:

* basic commandline tool

pending:

* broccoli-filter
* better commandline tools

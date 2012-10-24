ead-finder
==========

ead-finder is a small Node utility that looks for EAD XML that has been 
indexed by Google and [ArchiveGrid](http://beta.worldcat.org/archivegrid/).
The results are kept in a Redis database, and can be dumped with a small
python program. You can find a recent-ish dump of the database in the 
dump.json file.

Run It
------

1. sudo apt-get install nodejs redis-server
1. git checkout https://github.com/edsu/ead-finder.git
1. cd ead-finder
1. npm install
1. node google.js
1. node archivegrid.js
1. pip install redis
1. python dump.py

License:
--------

* CC0

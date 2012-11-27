#!/usr/bin/env python

import json
import redis

stats = {}
db = redis.Redis()

for key in db.keys("*"):
    host, content_type = key.split("__")
    if not stats.get_key(host):
        stats[host] = {}
    stats[host][content_type] = list(db.smembers(key))

open("dump.json", "w").write(json.dumps(stats, indent=2))

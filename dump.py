#!/usr/bin/env python

import json
import redis

stats = {"html": {}, "xml": {}}
db = redis.Redis()

for key in db.keys("*"):
    host, content_type = key.split("__")
    stats[content_type][host] = list(db.smembers(key))

open("dump.json", "w").write(json.dumps(stats, indent=2))

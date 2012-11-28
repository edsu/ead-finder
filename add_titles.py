#!/usr/bin/env python

"""
Attempts to look up a site title for the collection of
finding aids.
"""

import re
import json
import requests

data = json.loads(open("dump.json").read())

def get_title(url):
    try:
        res = requests.get(url)
        html = res.text
        m = re.search("<title>(.+)</title>", html)
        if m:
            return m.group(1)
        else:
            return None
    except: 
        return None

for hostname in data.keys():
    url = "http://" + hostname

    title = get_title(url)
    if not title and data[hostname].has_key("html"):
        title = get_title(data[hostname]["html"][0])

    data[hostname]["title"] = title

open("dump.json", "w").write(json.dumps(data, indent=2).encode("utf-8", "ignore"))

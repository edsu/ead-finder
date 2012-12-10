#!/usr/bin/env python

"""
Reads the JSON dump and writes out a wikitext table.
"""

import json

data = json.loads(open("dump.json").read())
hostnames = data.keys()
hostnames.sort(lambda a, b: cmp(data[a]['title'], 
                                data[b]['title']))

print """
{| class="wikitable sortable"
|- 
! Organization
! width="200px" | Examples"""

for hostname in hostnames:
    title = data[hostname]["title"] or ""
    url = "http://" + hostname 
    examples = []

    if data[hostname].has_key('html'):
        examples.append("[%s html]" % data[hostname]['html'][0])
    if data[hostname].has_key('xml'):
        examples.append("[%s xml]" % data[hostname]['xml'][0])

    examples = ' '.join(examples)
    line = "|-\n| [%s %s]\n| %s" % (url, title, examples)
    print line.encode("utf-8")
                               
print "|}"

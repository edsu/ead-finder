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
! Name 
! Website URL 
! width="200px" | EAD Example"""

for hostname in hostnames:
    title = data[hostname]["title"] or ""
    url = "http://" + hostname 

    if data[hostname].has_key('xml'):
        xml_url = data[hostname]['xml'][0]
    else:
        continue

    line = "|-\n| %s\n|%s\n| %s" % (title, url, xml_url)
    print line.encode("utf-8")
                               
print "|}"

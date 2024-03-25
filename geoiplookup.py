#!/usr/bin/env python3

import sys
import geoip2.database

# This reader object should be reused across lookups as creation of it is
# expensive.
with geoip2.database.Reader('/usr/local/var/GeoIP/GeoLite2-City.mmdb') as reader:
    response = reader.city(sys.argv[1]);
    print(response.country.names.get("en"), response.country.iso_code, response.city.names.get("en"))

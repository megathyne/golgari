Key questions
1. Need to know how long the url should be 

2. Need to know the scale of the application
- Example: 1,000 URLs generated per second
- 1000 * 60 * 60 * 24 * 365 = 31.5 billion urls created each year
- qty * seconds in a minute * minutes in a hour * hours in a day * days in a year
- 10 to 1 read to write requests means 300 billion reads per year 

3. What characters can we use?
- Alphanumeric:
    a-z 26
    A-Z 26
    0-9 10
  total 62 characters

Unique short urls based on character count
62 ** 1 = 62
62 ** 2 = 3,844
62 ** 3 = 238,328
...
62 ** 6 = 56 billion
62 ** 7 = 3.5 trillion


System Design
client -> load balancer -> web servers -> database

you can break up the webserver and the short url generator
you can horizontally scale them but it will introduce collisions
you solve this by adding configuration to the short generator, a range of values that it can pull from, for each instance of it. Meaning 1st instance can generate values 1 to 1m, second instance is 1m to 2m and so on. A tool for this is apache zookeeper

you can use a column based database like cassandra to go fast
or use sharding in postgres

use memcache or redis to create a cache for the most popular urls

Additional talking points
1. Analytics
    - counts for each URL to determine which short URLS to cache
    - IP address to store location information to determine where to locate caches etc

2. Rate limiting
    - prevent DDoS attacks by malicious users

3. Security considerations
    - add a random suffix to the short url to prevent hackers predicting urls
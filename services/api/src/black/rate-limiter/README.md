Rate Limiter

Where to implement
Client Side
    - Pros: Immediate feedback, reduced server load
    - Cons: Easily bypassed, inconsistent enforcement

Server Side
    - Pros: Centralized control, enhanced security
    - Cons: Increased server load, scalability challenges

Middleware
    - Pros: Scalable management, flexible policies
    - COns: Additional complexity, potential bottlenecks

Requirements                    Why Necessary?
Specify Rate Limits             Establish clear boundries to ensure fair usage, prevents abuse, and protects system resources from being overwhelmed 
Configurability and Flexibility Flexibility enables the system to adapt to changing requirements and handle diverse traffic patterns effectively
Low Latency & High Performance  High-performance rate limitng ensures tht legitimate requests are processed quickly, maintaining a smooth user experience

Popular Rate Limiting Algorithms: 
Token Bucket (stripe)
    FLOW:
        - tokens enter the bucket at a fixed rate (fill rate & bucket capacity)
        - when the user makes a request, the system checks to see if a token in available
        - requests require a token to proceed
        - if a token is available, it is removed from the bucket, the request is processed
        - if no token is availble, the request is denied or queued untill another token is available
    PROs: flexible in handling short-term burst requests, easy to implement
    CONs: memory consumption issue, if each user has a bucket, lack of guarantee for smooth request rate, complex paramater tuning (takes a while to get token rate and bucket size correct)
    USE: widely used for public api rate limiting

Leaky Bucket (used in streaming services) (FIFO Queue)
    FLOW: 
        - requests enter at any rate
        - requests are in a bucket that has a fixed capacity
        - requests are leaked out in a constant rate
        - requests that are in excess are discarded
    PROs: stable traffic control, easy to implement
    CONs: lacks flexibility in handling sudden traffic spikes, excess requests are discarded
    USE: stable traffic handling with minimal need for handling sudden spikes
        - network bandwidth management, server request handling, video streaming

Fixed Window Counter
    FLOW:
        - divide time into fixed windows
        - within each window, count the number of requests
        - if the number of requests exceeds the set threshold, any excess requests will be rejected
        - at the end of each window, the counter resets and starts counting again
    PROs: simple in principle, easy to implement, no need for complex state management, allow short-term peak requests
    CONs: window boundry issue, requests can exceed the threshold, potentially twice the limit
    USE: a simple rate limiting strategy is required, system traffic is generally stable, but there are short-term fluctuations
        - API rate limiting, access control like protecting login, 

Sliding Window Log
    Notes:
        - Dynamic window: the time window shifts continuously with time
        - Timestamp log: the system logs the timestamps of accepted requests
        - Request review: each new request is checked against the number of accepted requests in recent window. If it's within the threshold, it's accepted and logged; otherwise, it's denied. 
    Flow: 
        - define a log time window (3reqs/10secs)
        - within the window, count time of the requests
        - if within the range, process the request
        - if not, drop the request
        - on new request, drop expired timestamps from the window to free up availability
    PROs: fine-grained traffic control, no window boundary issue, 
    CONs: Increased complexity in processing, must maintain logs


Sliding Window Counter
    Notes: 
        - strikes a balance between fixed window counter and sliding window log
        - compared to Fixed Window COunter, more accurate, can smooth window boundry traffic, but more complex to implement
        - compared to Sliding window log, simple calucaltion, less storage, but not accurate enough, the threshold can still be exceeded at the boundary
    Formula: 
        - weight = (1 - x%) * lastWindowRequests + currentWindowRequests
        - x is the proportion of request time within the current window
        - accept request if weight + 1 isLessThanOrEqual LIMIT, otherwise reject
    Flow
        - define a LIMIT (3reqs/5sec)
        - create a counter
        - track last window requests and current window requests
        - similar to fixed window but instead it continusly tracks the number of requests in the past defined period 
        - as time moves forward, it removes old requests and adds new ones
        - fixes the burst issue seen in the fixed window by distributing request limits more evenly over time

Architecture
Client App -> Gateway (enforce the rate limits) -> Use redis to check for available tokens
If overwhelmed, respond with a 429 too many requests status code
Admin App (dynamically adjust rate) -> SQS -> Lambda -> Update gateway api's in memory config

Considerations:
- Sytem scale
- Traffic patterns
- The need for precision
- Burst handling
- Distributed rate limiting
- Logging and Alarms


Fixed Window Counter -vs- Token Bucket
reset method:       Reset counter to zero at the end of each window -vs- Refill tokens periodically, accumulate previously unused tokens
state management:   Simple -vs- Complex

Nice Options: add rate limit info in the return headers 
$curl -i https://api.blahblah.com/users
> HTTP/2 200
> x-ratelimit-limit: 60
> x-ratelimit-remaining: 56
> x-ratelimit-used: 4
> x-ratelimit-reset: 1372710543


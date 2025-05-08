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
    - fixed bucket of tokens
    - they are added to the bucket at a steady rate
    - each request requires a token to proceed
    - if a token is available, it is removed from the bucket, the request is processed
    - if no token is availble, the request is denied or queued untill another token is available
    - a retry or DLQ could be implemented

Leaky Bucket (used in streaming services)
    - requests are in a bucket and are leaked out in a constant rate
    - if the bucket overflows, the excess requests are sent to a retry queue

Fixed Window Counter
    - works by dividing the time into fixed intervals or windows
    - the number of requests is counted in each window
    - when the limit is reached within a window
    - additional requests are blocked untill the next window starts
    - easy to implement, but it can lead to bursts at window boundries

Sliding Window Log

Sliding Window Counter
    - similar to fixed window but instead it continusly tracks the number of requests in the past defined period 
    - as time moves forward, it removes old requests and adds new ones
    - fixes the burst issue seen in the fixed window by distributing request limits more evenly over time

Architecture
Client App -> Gateway (enforce the rate limits) -> Use redis to check for available tokens
If overwhelmed, respond with a 429 too many requests status code
Admin App (dynamically adjust rate) -> SQS -> Lambda -> Update gateway api's in memory config

Considerations:
- Burst handling
- Distributed rate limiting
- Logging and Alarms
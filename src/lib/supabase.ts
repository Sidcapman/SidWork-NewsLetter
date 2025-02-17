import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const isAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const seedArticles = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const articles = [
      {
        title: "Understanding Kafka Partitions and Message Polling",
        content: `Apache Kafka is a distributed streaming platform that's revolutionizing how we handle real-time data streams. Today, I'd like to share some key insights about Kafka partitions and message polling that I learned while implementing a high-throughput event processing system.

Key Concepts:

1. Partitions in Kafka
- Partitions are the fundamental unit of parallelism in Kafka
- Each partition is an ordered, immutable sequence of records
- Partitions allow horizontal scaling and parallel processing
- Messages with the same key go to the same partition

2. Message Offsets
- Each message in a partition has a unique offset
- Offsets are sequential numbers assigned to messages
- Consumers use offsets to track their position in the partition
- You can seek to specific offsets for replay or skip

3. Polling Messages Between Offsets
Example code I implemented today:

\`\`\`java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "my-group");
props.put("enable.auto.commit", "false");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
TopicPartition partition = new TopicPartition("my-topic", 0);

// Seek to specific offsets
consumer.assign(Arrays.asList(partition));
consumer.seek(partition, startOffset);

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        if (record.offset() <= endOffset) {
            processMessage(record);
        } else {
            break;
        }
    }
}
\`\`\`

4. Best Practices I Learned
- Always handle partition rebalancing gracefully
- Use consumer groups for scalable processing
- Monitor lag and offset progress
- Implement proper error handling and retry mechanisms

This implementation significantly improved our system's throughput and reliability. Next week, I'll dive into Kafka's replication and fault tolerance mechanisms.`,
        user_id: user.id,
        created_at: new Date('2025-02-15T10:00:00Z').toISOString()
      },
      {
        title: "Golang Project Structure and Goroutines: A Practical Guide",
        content: `Today, I implemented a new microservice in Go, and I want to share some insights about Go project structure and goroutines that made our service both maintainable and performant.

1. Go Project Structure
I've found this structure to be incredibly effective:

\`\`\`
myproject/
├── cmd/                    # Main applications
│   └── server/            # The API server
│       └── main.go        # Entry point
├── internal/              # Private code
│   ├── handler/          # HTTP handlers
│   ├── service/          # Business logic
│   └── repository/       # Data access
├── pkg/                   # Public libraries
│   ├── middleware/       # HTTP middleware
│   └── validator/        # Input validation
├── api/                   # API contracts
└── go.mod                 # Dependencies
\`\`\`

2. Goroutines and Concurrency
Here's a pattern I implemented today for concurrent API requests:

\`\`\`go
func ProcessUserData(users []User) []Result {
    results := make(chan Result, len(users))
    var wg sync.WaitGroup

    for _, user := range users {
        wg.Add(1)
        go func(u User) {
            defer wg.Done()
            // Process user data
            result := processUser(u)
            results <- result
        }(user)
    }

    // Close results channel after all goroutines complete
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    var finalResults []Result
    for result := range results {
        finalResults = append(finalResults, result)
    }

    return finalResults
}
\`\`\`

3. Project Ideas I'm Exploring
a) Real-time Chat Service
- WebSocket connections with goroutines
- Redis for pub/sub
- JWT authentication

b) Task Queue System
- Worker pools with goroutines
- PostgreSQL for persistence
- Redis for rate limiting

c) API Gateway
- Reverse proxy with load balancing
- Circuit breaker pattern
- Request/Response logging

Key Learnings:
1. Use channels for communication between goroutines
2. Implement proper error handling and context cancellation
3. Monitor goroutine leaks
4. Use sync.WaitGroup for coordination

Next week, I'll dive into implementing graceful shutdown patterns and advanced error handling in Go microservices.`,
        user_id: user.id,
        created_at: new Date('2025-02-16T14:30:00Z').toISOString()
      }
    ];

    for (const article of articles) {
      const { error } = await supabase
        .from('articles')
        .insert([article]);

      if (error) {
        console.error('Error seeding article:', error);
      }
    }
  } catch (error) {
    console.error('Error seeding articles:', error);
  }
};
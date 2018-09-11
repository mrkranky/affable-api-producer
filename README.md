# Affable-api-producer ![CI status](https://img.shields.io/badge/build-passing-brightgreen.svg)

Express app to consume from Mockstagram API and produce asynchronously into kafka topic

## Installation
To install and run -

`$ npm install`

`$ npm start`

## Prerequisites/Setup
Create a kafka topic 'influencers', in which the influencer's update would be pushed.

`$ bin/kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 10 --topic influencers`

## Benchmarks
Benchmarking on -
```
Macbook Air
8 GB 1600 MHz DDR3
1.6 GHz Intel Core i5
```

1. With single instance - able to produce 500 records/sec
2. With single instance, multiple workers - able to produce 800 records/sec
3. With single instance, multiple workers, batch produce in kafka (batch interval of 4 secs) - able to produce 1500 records/sec

## Scaling

Increasing instances, linearly would increase production rate.
For example: 10 instances could be divided into different ranges of consumption.

Instance 1 - produces for users between range 1000000 - 1100000

Instance 2 - produces for users between range 1100000 - 1200000

.

.

Instance 10 - produces for users between range 1900000 - 2000000

all producing parallelly to kafka topic...

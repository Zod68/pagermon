#!/bin/bash

cd .. && echo "POCSAG512: Address: 1000000  Function: 0  Alpha: `date` Test message<EOT>" | node ./reader.js

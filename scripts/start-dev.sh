#!/bin/bash

# Increase file descriptor limit to prevent EMFILE errors
ulimit -n 4096

# Start dev server
cd /home/ubuntu/flinkly
pnpm run dev

#!/usr/bin/env bash

PORT=${PORT:-8001}
uvicorn main:app --host 0.0.0.0 --port $PORT

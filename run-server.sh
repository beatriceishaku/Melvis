#!/bin/bash
cd /workspace/Melvis/server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

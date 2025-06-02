import json
import random
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Load the intents JSON file
INTENTS_PATH = Path(__file__).parent / 'intents.json'
with open(INTENTS_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)
    INTENTS = data.get('intents', [])

# Compile regex patterns for each intent for faster matching
for intent in INTENTS:
    intent['patterns_compiled'] = [re.compile(pattern, re.IGNORECASE) for pattern in intent.get('patterns', [])]


def get_response(user_input: str) -> str:
    """
    Try to find a matching intent. If found, return a random response.
    Returns empty string if no intent matches.
    """
    for intent in INTENTS:
        for pattern in intent['patterns_compiled']:
            if pattern.search(user_input):
                responses = intent.get('responses', [])
                if responses:
                    return random.choice(responses)
    return ""


def get_intent_and_response(user_input: str) -> Tuple[Optional[Dict], str]:
    """
    Return both the matched intent and response
    """
    for intent in INTENTS:
        for pattern in intent['patterns_compiled']:
            if pattern.search(user_input):
                responses = intent.get('responses', [])
                if responses:
                    return intent, random.choice(responses)
    return None, ""


# Load intents.json
def load_intents(path='intents.json'):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)['intents']


# Convert intents to a list of (prompt, response) pairs
def build_pairs(intents):
    pairs = []
    for intent in intents:
        tag = intent.get('tag')
        patterns = intent.get('patterns', [])
        responses = intent.get('responses', [])
        for pattern in patterns:
            # randomly choose one response per pattern
            if responses:
                response = random.choice(responses)
                pairs.append({
                    'prompt': pattern.strip(),
                    'response': response.strip()
                })
    return pairs


# Write out to JSONL for Hugging Face fine‑tuning
def write_jsonl(pairs, out_file='training_data.jsonl'):
    with open(out_file, 'w', encoding='utf-8') as f:
        for pair in pairs:
            f.write(json.dumps(pair, ensure_ascii=False) + '\n')


# Main execution
if __name__ == '__main__':
    intents = load_intents('intents.json')
    pairs = build_pairs(intents)
    write_jsonl(pairs)
    print(f"Wrote {len(pairs)} prompt‑response pairs to training_data.jsonl")

import httpx
import sys

def test_ollama():
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3:latest",
        "prompt": "Say hello in one sentence.",
        "stream": False
    }
    
    print(f"Testing Ollama at {url} with model 'llama3:latest'...")
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json().get('response')}")
            else:
                print(f"Error: {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_ollama()

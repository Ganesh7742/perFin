import requests, json

url = 'http://localhost:8000/api/auth/login'
data = {'email': 'test@test.com', 'password': 'password123'}
response = requests.post(url, json=data)

if response.status_code == 200:
    token = response.json().get('access_token')
    print(f"Login successful, token: {token}")

    me_url = 'http://localhost:8000/api/analyze/me'
    headers = {'Authorization': f'Bearer {token}'}
    me_response = requests.get(me_url, headers=headers)
    print(f"Analyze me status: {me_response.status_code}")
    if me_response.status_code == 200:
        print("Analysis successfully retrieved.")
    else:
        print("Analysis not found (expected for new user).")
else:
    print(f"Login failed: {response.text}")

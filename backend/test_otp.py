import asyncio
from database import connect_db, get_collection
from email_utils import send_otp_email
from datetime import datetime
import string
import random

async def main():
    await connect_db()
    print('Connected DB')
    col = get_collection('otps')
    
    print('Updating DB...')
    try:
        await asyncio.wait_for(
            col.update_one({'email': 'test@test.com'}, {'$set': {'otp': '123456', 'verified': False}}, upsert=True),
            timeout=5.0
        )
        print('DB Updated')
    except Exception as e:
        print(f"DB update failed: {repr(e)}")
        return
        
    print('Sending Email...')
    try:
        res = send_otp_email('test@test.com', '123456')
        print(f'Result: {res}')
    except Exception as e:
        print(f"Email failed: {repr(e)}")

asyncio.run(main())

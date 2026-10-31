import os

upload_dir = r"C:\Users\Dell\.gemini\antigravity\brain\0bf34c86-aff5-46b3-8e8b-d5e17b57b2f6\.user_uploaded"
if os.path.exists(upload_dir):
    for f in os.listdir(upload_dir):
        p = os.path.join(upload_dir, f)
        print(f"File: {f}, Size: {os.path.getsize(p)} bytes")

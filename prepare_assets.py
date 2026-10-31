import os
import shutil

assets_dir = r"D:\desk\DocConnect\presentation_assets"
os.makedirs(assets_dir, exist_ok=True)

# Copy DBIT logo
src_logo = r"D:\desk\DocConnect\extracted_assets\slide_1_Google_Shape_90_p13_0.png"
dst_logo = os.path.join(assets_dir, "dbit_logo.png")
shutil.copy2(src_logo, dst_logo)

# Copy Architecture diagram
src_arch = r"D:\desk\DocConnect\extracted_assets\slide_7_Google_Shape_177_p19_9.png"
dst_arch = os.path.join(assets_dir, "architecture_diagram.png")
shutil.copy2(src_arch, dst_arch)

# Copy user screenshots
upload_dir = r"C:\Users\Dell\.gemini\antigravity\brain\0bf34c86-aff5-46b3-8e8b-d5e17b57b2f6\.user_uploaded"
shutil.copy2(os.path.join(upload_dir, "media_1792345604218_b65007fe.jpg"), os.path.join(assets_dir, "screenshot_dashboard.jpg"))
shutil.copy2(os.path.join(upload_dir, "media_1792345604218_47e40bef.jpg"), os.path.join(assets_dir, "screenshot_booking.jpg"))
shutil.copy2(os.path.join(upload_dir, "media_1792345604218_e0a81544.jpg"), os.path.join(assets_dir, "screenshot_specialists.jpg"))

print("Assets prepared successfully:")
for f in os.listdir(assets_dir):
    p = os.path.join(assets_dir, f)
    print(f" - {f} ({os.path.getsize(p)} bytes)")

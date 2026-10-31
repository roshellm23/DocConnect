import os
from pptx import Presentation

pptx_path = r"C:\Users\Dell\.gemini\antigravity\brain\0bf34c86-aff5-46b3-8e8b-d5e17b57b2f6\.user_uploaded\media_1792345626916_507b3703.pptx"
out_dir = r"D:\desk\DocConnect\extracted_assets"
os.makedirs(out_dir, exist_ok=True)

prs = Presentation(pptx_path)

img_idx = 0
for i, slide in enumerate(prs.slides):
    for shape in slide.shapes:
        if shape.shape_type == 13: # picture
            image = shape.image
            ext = image.ext
            filename = f"slide_{i+1}_{shape.name}_{img_idx}.{ext}".replace(";", "_").replace(" ", "_")
            out_path = os.path.join(out_dir, filename)
            with open(out_path, "wb") as f:
                f.write(image.blob)
            print(f"Extracted {filename} ({len(image.blob)} bytes) from Slide {i+1}")
            img_idx += 1

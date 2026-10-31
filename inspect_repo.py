import os

target_dirs = ['docker', 'jenkins', 'k8s', 'terraform', 'backend', 'frontend', 'database']
for d in target_dirs:
    full_path = os.path.join(r'D:\desk\DocConnect', d)
    if os.path.exists(full_path):
        print(f"=== {d} ===")
        for root, dirs, files in os.walk(full_path):
            rel_root = os.path.relpath(root, r'D:\desk\DocConnect')
            for f in files:
                f_path = os.path.join(root, f)
                size = os.path.getsize(f_path)
                print(f"  {rel_root}/{f} ({size} bytes)")
    else:
        print(f"=== {d} DOES NOT EXIST ===")

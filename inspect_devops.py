import os

target_dirs = ['docker', 'jenkins', 'k8s', 'terraform']
for d in target_dirs:
    full_path = os.path.join(r'D:\desk\DocConnect', d)
    print(f"=== {d} ===")
    if os.path.exists(full_path):
        files = os.listdir(full_path)
        print(f"Files in {d}: {files}")
        for f in files:
            p = os.path.join(full_path, f)
            if os.path.isfile(p):
                print(f"  {f} ({os.path.getsize(p)} bytes)")
    else:
        print(f"Directory {d} does not exist")

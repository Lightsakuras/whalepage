import zipfile, os
stage = r'D:\whalepage\_site'
out = r'D:\whalepage\products\dist\ligsa-site.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(stage):
        for f in files:
            p = os.path.join(root, f)
            arc = os.path.relpath(p, stage).replace(os.sep, '/')
            z.write(p, arc)
with zipfile.ZipFile(out) as z:
    print('--- zip entries ---')
    for n in z.namelist(): print(n)
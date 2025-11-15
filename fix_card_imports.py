#!/usr/bin/env python3
import re
from pathlib import Path

PAGES_DIR = Path("/home/ubuntu/flinkly/client/src/pages")

def fix_imports(file_path: Path):
    content = file_path.read_text()
    original = content
    
    # Entferne Card-Import-Zeile komplett
    content = re.sub(r'import \{ Card, CardContent, CardHeader, CardTitle \} from "@/components/ui/card";\n', '', content)
    
    # Falls Card noch einzeln importiert wird
    content = re.sub(r'import \{ Card \} from "@/components/ui/card";\n', '', content)
    
    if content != original:
        file_path.write_text(content)
        print(f"✅ Fixed imports in {file_path.name}")
        return True
    return False

def main():
    fixed = 0
    for file_path in PAGES_DIR.glob("*.tsx"):
        if fix_imports(file_path):
            fixed += 1
    print(f"\n📊 Fixed {fixed} files")

if __name__ == "__main__":
    main()

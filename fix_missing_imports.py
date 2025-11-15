#!/usr/bin/env python3
import re
from pathlib import Path

PAGES_DIR = Path("/home/ubuntu/flinkly/client/src/pages")

def fix_imports(file_path: Path):
    content = file_path.read_text()
    original = content
    
    # Check if CardContent/CardHeader/CardTitle are used
    uses_card_components = any(x in content for x in ['CardContent', 'CardHeader', 'CardTitle'])
    
    # Check if already imported
    has_card_import = 'from "@/components/ui/card"' in content
    
    if uses_card_components and not has_card_import:
        # Find PremiumPageLayout import line
        match = re.search(r'(import \{ PremiumPageLayout.*?\} from "@/components/PremiumPageLayout";)', content)
        if match:
            insert_pos = match.end()
            card_import = '\nimport { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";'
            content = content[:insert_pos] + card_import + content[insert_pos:]
            file_path.write_text(content)
            print(f"✅ Fixed {file_path.name}")
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

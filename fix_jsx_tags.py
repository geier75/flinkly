#!/usr/bin/env python3
"""Fix JSX closing tag errors"""
import re
from pathlib import Path

PAGES_DIR = Path("/home/ubuntu/flinkly/client/src/pages")

def fix_page(file_path: Path):
    """Fix JSX closing tags in a page"""
    content = file_path.read_text()
    original = content
    
    # Fix: </div> should be </PremiumPageLayout> when PremiumPageLayout is open
    # Pattern: Find return ( <PremiumPageLayout> ... </div> );
    # Replace last </div> before ); with </PremiumPageLayout>
    
    # Count opening and closing tags
    premium_opens = content.count('<PremiumPageLayout')
    premium_closes = content.count('</PremiumPageLayout>')
    
    if premium_opens > premium_closes:
        # Need to replace some </div> with </PremiumPageLayout>
        diff = premium_opens - premium_closes
        
        # Find all return statements with PremiumPageLayout
        pattern = r'return \(\s*<PremiumPageLayout[^>]*>(.*?)\);'
        matches = list(re.finditer(pattern, content, re.DOTALL))
        
        for match in matches:
            block = match.group(1)
            # Check if this block ends with </div> instead of </PremiumPageLayout>
            if block.strip().endswith('</div>') and '</PremiumPageLayout>' not in block:
                # Replace the last </div> with </PremiumPageLayout>
                old_block = match.group(0)
                new_block = old_block.rsplit('</div>', 1)[0] + '</PremiumPageLayout>' + old_block.rsplit('</div>', 1)[1]
                content = content.replace(old_block, new_block, 1)
    
    # Fix duplicate p-6 md:p-8
    content = re.sub(r'(p-6 md:p-8\s+)+', 'p-6 md:p-8 ', content)
    
    if content != original:
        file_path.write_text(content)
        print(f"✅ Fixed {file_path.name}")
        return True
    return False

def main():
    fixed = 0
    for file_path in PAGES_DIR.glob("*.tsx"):
        if fix_page(file_path):
            fixed += 1
    print(f"\n📊 Fixed {fixed} files")

if __name__ == "__main__":
    main()

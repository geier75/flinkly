#!/usr/bin/env python3
"""
Automatische Transformation aller Pages zum Ultra-Luxus-Design
"""
import os
import re
from pathlib import Path

PAGES_DIR = Path("/home/ubuntu/flinkly/client/src/pages")

# Seiten die bereits im Ultra-Luxus-Design sind
SKIP_PAGES = ["Home.tsx", "Marketplace.tsx", "GigDetail.tsx", "CreateGig.tsx"]

def transform_page(file_path: Path) -> str:
    """Transformiert eine einzelne Page-Datei"""
    content = file_path.read_text()
    
    # 1. Import PremiumPageLayout hinzufügen
    if "PremiumPageLayout" not in content:
        # Nach den ersten Imports einfügen
        import_section = re.search(r'(import.*?from.*?;)\n', content)
        if import_section:
            insert_pos = import_section.end()
            premium_import = 'import { PremiumPageLayout, PremiumCard } from "@/components/PremiumPageLayout";\nimport { motion } from "framer-motion";\n'
            content = content[:insert_pos] + premium_import + content[insert_pos:]
    
    # 2. Wrapper mit PremiumPageLayout hinzufügen
    # Finde return Statement
    return_match = re.search(r'return \(\s*<div className="min-h-screen', content)
    if return_match:
        # Ersetze <div className="min-h-screen bg-slate-50"> durch PremiumPageLayout
        content = re.sub(
            r'return \(\s*<div className="min-h-screen bg-slate-50[^"]*">',
            'return (\n    <PremiumPageLayout>',
            content
        )
        # Schließendes </div> durch </PremiumPageLayout> ersetzen (letztes im return)
        # Finde letztes </div> vor dem schließenden )
        content = re.sub(r'</div>\s*\);(\s*)$', r'</PremiumPageLayout>\n  );\1', content, count=1)
    
    # 3. Alle <Card> durch <PremiumCard> ersetzen
    content = content.replace('<Card ', '<PremiumCard ')
    content = content.replace('</Card>', '</PremiumCard>')
    content = content.replace('<Card>', '<PremiumCard>')
    
    # 4. Farben ersetzen
    content = content.replace('bg-slate-50', 'bg-transparent')
    content = content.replace('text-blue-600', 'text-primary')
    content = content.replace('text-blue-500', 'text-primary')
    
    # 5. CardContent mit Padding
    content = re.sub(
        r'<CardContent className="([^"]*)"',
        r'<CardContent className="\1 p-6 md:p-8"',
        content
    )
    
    return content

def main():
    """Hauptfunktion"""
    print("🚀 Starte automatische Transformation...")
    
    transformed = 0
    skipped = 0
    
    for file_path in PAGES_DIR.glob("*.tsx"):
        if file_path.name in SKIP_PAGES:
            print(f"⏭️  Überspringe {file_path.name} (bereits transformiert)")
            skipped += 1
            continue
        
        print(f"🔄 Transformiere {file_path.name}...")
        try:
            transformed_content = transform_page(file_path)
            file_path.write_text(transformed_content)
            print(f"✅ {file_path.name} erfolgreich transformiert")
            transformed += 1
        except Exception as e:
            print(f"❌ Fehler bei {file_path.name}: {e}")
    
    print(f"\n📊 Zusammenfassung:")
    print(f"   ✅ Transformiert: {transformed}")
    print(f"   ⏭️  Übersprungen: {skipped}")
    print(f"   📁 Gesamt: {transformed + skipped}")

if __name__ == "__main__":
    main()

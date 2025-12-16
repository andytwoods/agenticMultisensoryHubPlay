import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def extract_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # Namespace for Word
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            text_parts = []
            for p in tree.findall('.//w:p', ns):
                texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
                if texts:
                    text_parts.append(''.join(texts))
                else:
                    text_parts.append('') # Preserve paragraph breaks
            
            return '\n'.join(text_parts)
    except Exception as e:
        return f"Error reading docx: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <path_to_docx>")
        sys.exit(1)
        
    docx_path = sys.argv[1]
    if not os.path.exists(docx_path):
        print(f"File not found: {docx_path}")
        sys.exit(1)
        
    content = extract_text(docx_path)
    # Write to a file to avoid console encoding issues and for easy reading
    with open('extracted_content.txt', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Content extracted to extracted_content.txt")

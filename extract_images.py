import zipfile
import os
import sys

def extract_images(docx_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        with zipfile.ZipFile(docx_path) as z:
            for file_info in z.infolist():
                if file_info.filename.startswith('word/media/'):
                    original_filename = os.path.basename(file_info.filename)
                    target_path = os.path.join(output_dir, original_filename)
                    with z.open(file_info) as source, open(target_path, 'wb') as target:
                        target.write(source.read())
                    print(f"Extracted: {original_filename}")
    except Exception as e:
        print(f"Error extracting images: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python extract_images.py <docx_path> <output_dir>")
        sys.exit(1)

    docx_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    if not os.path.exists(docx_path):
        print(f"File not found: {docx_path}")
        sys.exit(1)

    print(f"Extracting images from {docx_path} to {output_dir}...")
    extract_images(docx_path, output_dir)
    print("Done.")

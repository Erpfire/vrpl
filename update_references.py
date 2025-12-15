import os
import re

def update_references(root_dir):
    # Extensions to modify
    target_extensions = {'.html', '.css', '.js'}
    
    # Regex to find .jpg or .jpeg (case insensitive)
    # This regex looks for patterns ending in .jpg or .jpeg
    # It identifies the extension part to replace it
    regex = re.compile(r'\.jpe?g', re.IGNORECASE)
    
    print(f"Scanning directory: {root_dir}")
    
    modified_count = 0
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip node_modules and .git
        if 'node_modules' in dirnames:
            dirnames.remove('node_modules')
        if '.git' in dirnames:
            dirnames.remove('.git')
        if '__pycache__' in dirnames:
            dirnames.remove('__pycache__')
            
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            ext = os.path.splitext(filename)[1].lower()
            
            # Only process target file types
            if ext in target_extensions:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Search if modification is needed
                    if regex.search(content):
                        new_content = regex.sub('.webp', content)
                        
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                            
                        print(f"Updated: {filename}")
                        modified_count += 1
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

    print(f"Update complete. Modified {modified_count} files.")

if __name__ == "__main__":
    update_references(os.getcwd())

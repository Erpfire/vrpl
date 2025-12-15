import os
from PIL import Image
from pathlib import Path

def get_size_format(b, factor=1024, suffix="B"):
    for unit in ["", "K", "M", "G", "T", "P", "E", "Z"]:
        if b < factor:
            return f"{b:.2f}{unit}{suffix}"
        b /= factor
    return f"{b:.2f}Y{suffix}"

def convert_images_to_webp(root_dir):
    extensions = {'.jpg', '.jpeg'}
    max_size_limit = 50 * 1024  # 50KB
    
    print(f"Scanning directory: {root_dir}")
    print(f"Target: Max 50KB or 20% of original size (whichever is smaller)")
    
    count = 0
    saved_space = 0
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            file_path = Path(dirpath) / filename
            if file_path.suffix.lower() in extensions:
                webp_path = file_path.with_suffix('.webp')
                
                try:
                    original_size = os.path.getsize(file_path)
                    target_size = min(original_size * 0.20, max_size_limit)
                    
                    with Image.open(file_path) as img:
                        # Convert to RGB if necessary
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        
                        # Iterative compression
                        quality = 80
                        scale = 1.0
                        
                        while True:
                            # Resize if scale < 1.0
                            if scale < 1.0:
                                new_size = (int(img.width * scale), int(img.height * scale))
                                # Prevent making it too tiny (e.g. icon size) unless necessary
                                if new_size[0] < 10 or new_size[1] < 10: 
                                    print(f"  Warning: Image {filename} becoming too small, stopping resize.")
                                    break
                                
                                current_img = img.resize(new_size, Image.Resampling.LANCZOS)
                            else:
                                current_img = img
                            
                            # Save to a temporary buffer to check size
                            import io
                            buffer = io.BytesIO()
                            current_img.save(buffer, format='WEBP', quality=quality, optimize=True)
                            size = buffer.tell()
                            
                            if size <= target_size:
                                with open(webp_path, 'wb') as f:
                                    f.write(buffer.getvalue())
                                break
                            
                            # Adjust parameters for next iteration
                            if quality > 10:
                                quality -= 10
                            else:
                                # Quality is already low, reduce dimensions
                                quality = 70 # Reset quality slightly for the new smaller size
                                scale *= 0.8 # Reduce size by 20%
                            
                            buffer.close()
                                
                    new_size = os.path.getsize(webp_path)
                    reduction = (original_size - new_size) / original_size * 100
                    saved_space += (original_size - new_size)
                    
                    print(f"Converted: {filename}")
                    print(f"  Orig: {get_size_format(original_size)} -> New: {get_size_format(new_size)} ({reduction:.1f}% reduction)")
                    
                    if new_size > max_size_limit:
                         print(f"  WARNING: Could not meet 50KB limit. Current: {get_size_format(new_size)}")

                    count += 1
                except Exception as e:
                    print(f"Failed to convert {file_path}: {e}")
    
    print(f"\nConversion complete. Total images: {count}")
    print(f"Total space saved: {get_size_format(saved_space)}")

if __name__ == "__main__":
    # check for 'assets/images' then 'images'
    working_dir = os.getcwd() 
    
    potential_dirs = [
        os.path.join(working_dir, "assets", "images"),
        os.path.join(working_dir, "images")
    ]
    
    target_dir = None
    for d in potential_dirs:
        if os.path.exists(d):
            target_dir = d
            break
            
    if target_dir:
        convert_images_to_webp(target_dir)
    else:
        print("Error: Could not find 'assets/images' or 'images' directory.")

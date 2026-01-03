let coverImageFilename = '';

class PostEditor {
    constructor() {
        this.postForm = document.getElementById('postForm');
        this.titleInput = document.getElementById('title');
        this.slugInput = document.getElementById('slug');
        this.excerptInput = document.getElementById('excerpt');
        this.categoryInput = document.getElementById('category');
        this.tagsInput = document.getElementById('tags');
        this.coverImageInput = document.getElementById('coverImage');
        this.publishedInput = document.getElementById('published');
        this.featuredInput = document.getElementById('featured');
        this.submitBtn = document.getElementById('submitBtn');
        this.imageUploadArea = document.getElementById('imageUploadArea');
        this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImage = document.getElementById('previewImage');

        this.init();
    }

    init() {
        // Check authentication
        if (typeof AdminSession !== 'undefined' && !AdminSession.isAuthenticated()) {
            window.location.href = '/admin-login.html';
            return;
        }

        this.initEditor();
        this.setupEventListeners();
    }

    initEditor() {
        $('#editor').summernote({
            placeholder: 'Write your blog post content here...',
            tabsize: 2,
            height: 400,
            useLegacyHtml: false, /* Force span style */
            styleWithSpan: true,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            callbacks: {
                onImageUpload: (files) => {
                    this.uploadImageToEditor(files[0]);
                }
            }
        });
    }

    setupEventListeners() {
        if (this.titleInput) {
            this.titleInput.addEventListener('input', () => this.generateSlug());
        }

        if (this.imageUploadArea && this.coverImageInput) {
            this.imageUploadArea.addEventListener('click', () => this.coverImageInput.click());
            this.coverImageInput.addEventListener('change', (e) => this.uploadCoverImage(e));
        }

        if (this.postForm) {
            this.postForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        document.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'remove-cover') {
                this.removeCoverImage();
            }
        });
    }

    removeCoverImage() {
        coverImageFilename = '';
        if (this.coverImageInput) this.coverImageInput.value = '';
        if (this.uploadPlaceholder) this.uploadPlaceholder.style.display = 'block';
        if (this.imagePreview) this.imagePreview.style.display = 'none';
    }

    generateSlug() {
        const title = this.titleInput.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        this.slugInput.value = slug || '';
    }

    async uploadCoverImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match(/image\/(jpeg|png|webp)/)) {
            alert('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('uploadType', 'cover');

        try {
            const token = typeof AdminSession !== 'undefined' ? AdminSession.getToken() : '';
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                coverImageFilename = data.data.filename;
                this.previewImage.src = data.data.url;
                this.uploadPlaceholder.style.display = 'none';
                this.imagePreview.style.display = 'block';
            } else {
                alert('Failed to upload image: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred while uploading the image');
        }
    }

    async uploadImageToEditor(file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('uploadType', 'content');

        try {
            const token = typeof AdminSession !== 'undefined' ? AdminSession.getToken() : '';
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                $('#editor').summernote('insertImage', data.data.url);
            } else {
                alert('Failed to upload editor image: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Editor image upload error:', error);
            alert('Failed to upload image');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const content = $('#editor').summernote('code');

        if (!content || content === '<p><br></p>') {
            alert('Please enter post content');
            return;
        }

        const tags = this.tagsInput.value
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);

        const postData = {
            title: this.titleInput.value.trim(),
            slug: this.slugInput.value.trim(),
            excerpt: this.excerptInput.value.trim(),
            content: content,
            category_id: this.categoryInput.value || null,
            tags: tags,
            published: this.publishedInput.checked,
            featured: this.featuredInput.checked,
            cover_image: coverImageFilename || null
        };

        this.setLoading(true);

        try {
            const token = typeof AdminSession !== 'undefined' ? AdminSession.getToken() : '';
            const response = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Post created successfully!');
                window.location.href = '/admin-dashboard.html';
            } else {
                alert('Failed to create post: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Create post error:', error);
            alert('An error occurred while creating the post');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        if (this.submitBtn) {
            if (isLoading) {
                this.submitBtn.disabled = true;
                this.submitBtn.originalText = this.submitBtn.textContent;
                this.submitBtn.textContent = 'Creating...';
            } else {
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = this.submitBtn.originalText || 'Create Post';
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('postForm')) {
        new PostEditor();
    }
});

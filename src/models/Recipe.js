export class Recipe {
  constructor(name = '', picture = null) {
    this.id = this.generateId()
    this.name = name
    this.picture = picture
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  uploadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'))
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'))
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        reject(new Error('File size must be less than 5MB'))
        return
      }

      const reader = new FileReader()
      
      reader.onload = (event) => {
        this.picture = event.target.result
        this.updatedAt = new Date()
        resolve(this.picture)
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsDataURL(file)
    })
  }

  removeImage() {
    this.picture = null
    this.updatedAt = new Date()
    return true
  }

  updateName(newName) {
    if (newName && newName.trim()) {
      this.name = newName.trim()
      this.updatedAt = new Date()
      return true
    }
    return false
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      picture: this.picture,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromJSON(data) {
    const recipe = new Recipe(data.name, data.picture)
    recipe.id = data.id
    recipe.createdAt = new Date(data.createdAt)
    recipe.updatedAt = new Date(data.updatedAt)
    return recipe
  }
} 
export class Recipe {
  constructor(name = '', picture = null, description = '', hearts = 0, directions = '') {
    this.id = this.generateId()
    this.name = name
    this.picture = picture
    this.description = description
    this.hearts = hearts
    this.directions = directions
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

  updateDescription(newDescription) {
    this.description = newDescription || ''
    this.updatedAt = new Date()
    return true
  }

  updateDirections(newDirections) {
    this.directions = newDirections || ''
    this.updatedAt = new Date()
    return true
  }

  updateHearts(newHearts) {
    const numHearts = Number(newHearts);
    if (!isNaN(numHearts) && numHearts >= 0 && numHearts <= 5) {
      this.hearts = numHearts;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      picture: this.picture,
      description: this.description,
      hearts: this.hearts,
      directions: this.directions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromJSON(data) {
    const recipe = new Recipe(data.name, data.picture, data.description || '', data.hearts || 0, data.directions || '')
    recipe.id = data.id
    recipe.createdAt = new Date(data.createdAt)
    recipe.updatedAt = new Date(data.updatedAt)
    return recipe
  }
} 
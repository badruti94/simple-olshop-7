const imageValidation = (file, name) => {
    let error;

    if (!file) {
        error = new Error('File is required')
    } else {
        if (!(file[name].mimetype === 'image/png'
            || file[name].mimetype === 'image/jpg'
            || file[name].mimetype === 'image/jpeg')) {
            error = new Error('File extension must be .png, .jpg, or .jpeg')
        }

        if (file[name].size > 1 * 1000 * 1000) {
            error = new Error('File size must be less than or equal to 1MB')
        }
    }

    if (error) {
        throw error
    }
}

module.exports = { imageValidation }
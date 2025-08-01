'use strict'

const blogCategoryModel = require('../models/blog-category.model')
const { BadRequestError } = require('../core/error.response')
const blogCategoryRepository = require('../models/repositories/blog-category.repository')

class BlogCategoryService {
  // Create
  static async createBlogCategory(payload) {
    return await blogCategoryModel.create(payload)
  }

  // Update
  static async updateBlogCategory(blogCategoryId, payload) {
    const blogCategory = await blogCategoryModel.findByIdAndUpdate(
      blogCategoryId,
      payload,
      {
        new: true,
      },
    )
    if (!blogCategory)
      throw new BadRequestError(
        `Blog Category not found with Id: ${blogCategoryId}`,
      )

    return blogCategory
  }

  // Delete
  static async deleteBlogCategory(blogCategoryId) {
    const blogCategory = await blogCategoryModel.findByIdAndDelete(
      blogCategoryId,
    )

    if (!blogCategory)
      throw new BadRequestError(
        `Blog Category not found with Id: ${blogCategoryId}`,
      )

    return blogCategory
  }

  // Query
  static async findBlogCategoryBySlug({ slug }) {
    return await blogCategoryRepository.findBlogCategoryBySlug({ slug })
  }
  static async findAllBlogCategories({
    limit = 10,
    sort = 'ctime',
    page = 1,
    select = [],
  }) {
    // Convert into array
    let selectFields = select
    if (typeof select === 'string') {
      selectFields = select.split(',').map((field) => field.trim())
    }
    const filter = {}

    return await blogCategoryRepository.findAllBlogCategories({
      limit,
      sort,
      page,
      filter,
      select: selectFields,
    })
  }
}

module.exports = BlogCategoryService
